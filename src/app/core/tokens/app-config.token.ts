import { InjectionToken } from "@angular/core";
import { AppConfig } from "@app/interfaces";

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config", {
    providedIn: "root",
    factory: () => ({
        boardSize: 3
    })
})