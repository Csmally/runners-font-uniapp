import {
	createSSRApp
} from "vue";
import { uniRequest } from "@/utils/tool.js";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	uniRequest("campus/search", "post").then(res=>{
		console.log('9898campuses',res.data)
		app.config.globalProperties.campuses = res.data
	})
	return {
		app,
	};
}
