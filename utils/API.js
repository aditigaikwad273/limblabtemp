import axios from "axios"
import { Platform } from "react-native"
import Config from "react-native-config"

// "https://app.limblab.com"
// 'https://limb-lab-dev.herokuapp.com'
// a21131ea-4d13-4c9e-a08d-c1783e67ed87
// 68bfe58c-6bdd-4c49-acb8-dcf8bacbf37a

const BASE_URL = Config.BASE_URL || "https://app.limblab.com"
const LL_API_KEY = Config.LL_API_KEY || "a21131ea-4d13-4c9e-a08d-c1783e67ed87"

const createAxiosInstance = (apiToken = null) => {
	const headers = {
		"Cache-Control": "no-cache",
		"X-LL-API-KEY": LL_API_KEY,
		"X-LL-API-CLIENT": Platform.OS,
	}

	if (apiToken) {
		headers["X-LL-API-TOKEN"] = apiToken
	}

	const instance = axios.create({
		baseURL: BASE_URL,
		headers,
	})

	// Add interceptors or other configurations if needed
	// instance.interceptors.request...

	return instance
}

export default createAxiosInstance
