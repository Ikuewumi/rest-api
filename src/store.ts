import { atom, computed, map } from "nanostores";
import { createRouter } from '@nanostores/router'

type Theme = 'light' | 'dark' | 'system'



const checkLsTheme = () => {
    const ls = localStorage.getItem('theme') ?? ''
    let lsTheme = 'system'

    if (['light', 'dark', 'system'].includes(ls)) lsTheme = ls
    
    localStorage.setItem('theme', lsTheme)
}


checkLsTheme()



export const $appData = map({
    'countries': [] as CountryInfo[],
    'region': 'all',
    'search': ''
})

export const $filtered = computed($appData, val => {

    const result = val.countries.filter(country => {

        const reg = val.region === 'all' ? true : country.region.toLowerCase() === val.region
        const srch = val.search === '' ? true : country.name.toLowerCase().includes(val.search)

        return reg && srch


    })

    return result

})



export const $theme = atom(localStorage.getItem('theme') ?? 'system' as Theme);



$theme.subscribe(theme => {
    localStorage.setItem('theme', theme)

    const html = document.querySelector('html')
    const themeBtn = document.querySelector('header button > span')!
    const svg = document.querySelector('header button > svg > use')! as SVGUseElement
    const next = (theme === 'system') ? 'dark' : (theme === 'dark' ? 'light' : 'system')
    const logos = (theme === 'system') ? 'material-symbols-dark-mode-outline' : (theme === 'dark' ? 'material-symbols-light-mode-outline' : 'material-symbols-laptop-chromebook-outline-rounded')
    
    if (html && themeBtn) {
        html.setAttribute('data-theme', theme)
        themeBtn.textContent = `${next} mode` 
        svg.setAttribute('href', `#${logos}`) 
    }
})



// $appData.subscribe((val, key) => {
//     // if (key && ['region', 'search'].includes(key)) {
//     //     // change the inputs' state
//     // }
// })



export const $router = createRouter({
    home: '/',
    detail: '/countries/:name'
})
