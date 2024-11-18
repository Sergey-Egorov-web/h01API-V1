"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = process.env.PORT || 5000;
settings_1.app.listen(port, () => {
    console.log(`HO1API-V1 app listening on port ${port}`);
});
