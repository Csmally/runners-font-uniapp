import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	app.config.globalProperties.campuses = []
	return {
		app,
	};
}
