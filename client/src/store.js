import {configureStore} from '@reduxjs/toolkit'
import userReducer from './features/auth/userSlice'
import reportReducer from './features/report/reportSlice'

const store = configureStore({
    reducer:{
        user: userReducer,
        reports: reportReducer
    }
})

export default store