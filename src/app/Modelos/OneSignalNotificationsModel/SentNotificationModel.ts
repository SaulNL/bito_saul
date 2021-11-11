import { AppSettings } from 'src/app/AppSettings';
import { CommonOneSignalModel } from "./CommonOneSignalModel";
export class SentNotificationModel {
    public app_id: string;
    public include_external_user_ids: Array<string>;
    public channel_for_external_user_ids: string;
    public data: any;
    public contents: CommonOneSignalModel;
    public large_icon: string;
    public name: string;
    public headings: CommonOneSignalModel;

    constructor(content: CommonOneSignalModel, headings: CommonOneSignalModel, externalUsersId: Array<string>, appId: string) {
        this.app_id = appId;
        this.channel_for_external_user_ids = 'push';
        this.large_icon = 'https://ecoevents.blob.core.windows.net/comprandoando/logos/Bitoo.png';
        this.name = "Bitoo";
        this.contents = content;
        this.headings = headings;
        this.include_external_user_ids = externalUsersId;
    }
}
