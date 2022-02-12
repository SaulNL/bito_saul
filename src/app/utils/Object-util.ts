export class ObjectUtil{
    public static isNullOrUndefined(object: any): boolean{
        return object === null || object === undefined;
    }
    public static containsNullOrUndefinedProperties(object: any, omittedKeys?: string[] ): boolean{

        let hasAnyPropertyWithNullOrUndefinedValue = false;
        Object.keys(object).forEach(key =>{
            let hasOmittedKey = false;
            if(!ObjectUtil.isNullOrUndefined(omittedKeys)){
                hasOmittedKey = omittedKeys.includes(key);
            }
            if(!hasOmittedKey && ObjectUtil.isNullOrUndefined(object[key])){
                hasAnyPropertyWithNullOrUndefinedValue = true;
                return;
            }
        });
        return hasAnyPropertyWithNullOrUndefinedValue;
    }
}