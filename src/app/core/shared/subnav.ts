export class SubNav {
    public static subNavLabel(val: string) {
        let splits = val.split('-');
        let newSplits = splits.map(x => x.charAt(0).toUpperCase() + x.slice(1));
        return newSplits.join(' ');
    }
    public static subNavValue(val: string) {
        let splits = val.split('-');
        let newSplits = splits.map((x,index) => {
            if(index) {
                return x.charAt(0).toUpperCase() + x.slice(1);
            } else {
                return x;
            }
        })
        return newSplits.join('');
    }
}

export interface SubNavItem {
    link: string;
    label: string;
    value: string;
}