import {CommonOneSignalModel} from "./CommonOneSignalModel";

export class SentNotificationModel {
    public app_id: string;
    public include_external_user_ids: Array<string>;
    public channel_for_external_user_ids: string;
    public data: any;
    public contents: CommonOneSignalModel;
    public large_icon: string;
    public name: string;
    public is_android: boolean;
    public is_ios: boolean;
    public headings: CommonOneSignalModel;

    constructor(isAndroid: boolean = false, isIos: boolean = false, content: CommonOneSignalModel, headings: CommonOneSignalModel, externalUsersId: Array<string>) {
        // this.app_id = '93413f70-9fe9-4bf6-99a9-a634829c45ea';
        this.app_id = '34f925eb-ac86-4815-99a3-baa667457acb';
        this.channel_for_external_user_ids = 'push';
        this.large_icon = 'https://ecoevents.blob.core.windows.net/comprandoando/logos/Bitoo.png';
        this.name = "Bitoo";
        this.is_android = isAndroid;
        this.is_ios = isIos;
        this.contents = content
        this.headings = headings;
        this.include_external_user_ids = externalUsersId;
    }
}
