const translit = (str: string) => { 
   const uaRu = 'А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я'.split('-');
    const en = "A-a-B-b-V-v-G-g-H-h-D-d-E-e-YO-yo-YE-ye-ZH-zh-Z-z-I-i-I-i-YI-yi-Y-y-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-KH-kh-TS-ts-CH-ch-SH-sh-SHCH-shch-'-''-Y-y-'-'-E-e-YU-yu-YA-ya".split('-');

    let res = '';
    for (let i = 0; i < str.length; i++) {
        let s = str.charAt(i)
        let n = uaRu.indexOf(s)
        if(n>=0){
            res+=en[n]
        }else{
            res+= s
        }

    }
    return res
}   
 export const generateSlug = (str: string): string => {
    let url: string = str.replace(/[\s]+/gi, '-')
    url = translit(url)
    url = url
        .replace('---', '-')
        .replace('--', '-')
        .toLowerCase()
    return url
 }