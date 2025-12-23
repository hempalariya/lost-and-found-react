import Report from "../models/Report.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const createReport = async (req, res) => {
  try {
    const {
      itemName,
      description,
      location,
      reportType,
      contactName,
      contactEmail,
      contactNumber,
    } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    const newReport = await Report.create({
      itemName,
      description,
      location,
      reportType,
      image: imagePath,
      contactEmail,
      contactName,
      contactNumber,
      createdBy: req.user?._id || req.user?.id,
    });

    res.json({
      success: true,
      message: "Report register",
      data: newReport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLostReport = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: "lost" });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoundReport = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: "found" });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('createdBy', 'userName')
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReport = async (req, res) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const deleteReport = async (req, res) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getMyReports = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });
    const reports = await Report.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markReturned = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const report = await Report.findOne({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!report)
      return res.status(404).json({ message: "Report not found or not authorized" });

    report.status = "returned";
    await report.save();

    res.json({ message: "Marked as returned", report });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const defaultMatcher = (target, candidates) => {
  // Very small local fallback: match by overlapping words and location.
  const normalize = (str = "") =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const targetWords = new Set([
    ...normalize(target.itemName),
    ...normalize(target.description),
  ]);
  const targetLocation = (target.location || "").toLowerCase();

  const scored = candidates.map((c) => {
    const words = new Set([
      ...normalize(c.itemName),
      ...normalize(c.description),
    ]);
    let score = 0;
    words.forEach((w) => {
      if (targetWords.has(w)) score += 1;
    });
    if (targetLocation && c.location?.toLowerCase().includes(targetLocation)) {
      score += 2;
    }
    return { id: c._id.toString(), score, reason: "Simple keyword match" };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, 5);
};

const askGeminiForMatches = async (target, candidates) => {
  if (!genAI) return [];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const candidatePayload = candidates.map((c) => ({
    id: c._id.toString(),
    itemName: c.itemName,
    description: c.description,
    location: c.location,
    reportType: c.reportType,
    status: c.status,
  }));

  const prompt = `You match lost and found items.
Target item:
${JSON.stringify(
    {
      id: target._id.toString(),
      itemName: target.itemName,
      description: target.description,
      location: target.location,
      reportType: target.reportType,
      status: target.status,
    },
    null,
    2
  )}

Candidate items:
${JSON.stringify(candidatePayload, null, 2)}

Choose up to 5 likely matches from the candidates. Return ONLY valid JSON shaped like:
{"matches":[{"id":"<candidateId>","reason":"short why it matches"}]}
If nothing looks related, return {"matches":[]}.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();
    if (!text) return [];

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const matches = parsed?.matches;
    if (!Array.isArray(matches)) return [];
    return matches
      .map((m) => ({
        id: m.id,
        reason: m.reason || "Suggested by Gemini",
      }))
      .slice(0, 5);
  } catch (err) {
    console.error("Gemini match error", err.message);
    return [];
  }
};

export const getReportMatches = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const oppositeType = report.reportType === "lost" ? "found" : "lost";
    const candidates = await Report.find({
      reportType: oppositeType,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(20);

    if (!candidates.length)
      return res.json({ matches: [], note: "No opposite-type reports yet" });

    const geminiMatches = await askGeminiForMatches(report, candidates);
    let matches = geminiMatches;

    if (!matches.length) {
      matches = defaultMatcher(report, candidates);
    }

    const matchesWithData = matches
      .map((m) => {
        const candidate = candidates.find(
          (c) => c._id.toString() === m.id?.toString()
        );
        if (!candidate) return null;
        return {
          report: candidate.toObject(),
          reason: m.reason || "AI suggested match",
        };
      })
      .filter(Boolean);

    res.json({ matches: matchesWithData, source: geminiMatches.length ? "gemini" : "fallback" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
