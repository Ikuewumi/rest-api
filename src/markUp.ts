import { getData } from "./api"
import { $appData, $filtered, $theme } from "./store"


const homeElem = document.querySelector('section#home')!;
const detailElem = document.querySelector('section#detail')!;
const ul = document.querySelector('section#home ul')!;
const formElem = document.querySelector('form')! as HTMLFormElement;
const regionInput = document.querySelector('section#home select')! as HTMLSelectElement; 
const searchInput = document.querySelector('section#home input')! as HTMLInputElement; 
const cardTemplate = document.querySelector('#cardTemplate')! as HTMLTemplateElement;
const themeBtn = document.querySelector('header button')! as HTMLButtonElement;
const topBtn = document.querySelector('button#up-btn')




export const loadAppData = async () => {

    if ($appData.value && $appData.value.countries.length > 1) { return $appData.value.countries }
    const d = await getData()
    $appData.set({
        'countries': d,
        'region': 'all',
        'search': ''
    })
    return d



}

const writeHomeMarkUp = (val:readonly CountryInfo[] | CountryInfo[]) => {
    if (!homeElem || homeElem.classList.contains('none')) return

    ul.innerHTML = ``;
    
    for(let i = 0; i < val.length; i++) {
        
        
        const clone = cardTemplate.content.cloneNode(true)! as Element;
        clone.querySelector('img')!.src = val[i].flag ?? '' 
        clone.querySelector('img')!.alt = val[i].name ?? '' 
        clone.querySelector('a')!.textContent = val[i].name ?? '';
        clone.querySelector('a')!.href = `/countries/${val[i].name}` ?? ''
        clone.querySelector('.population span')!.textContent = Intl.NumberFormat().format(val[i].population) ?? '';
        clone.querySelector('.region span')!.textContent = val[i].region ?? ''
        clone.querySelector('.capital span')!.textContent = val[i].capital ?? ''

        
        ul.appendChild(clone)
    }
    
}



export const populateHome = () => {
    detailElem.classList.add('none')
    homeElem.classList.remove('none')
    writeHomeMarkUp($filtered.get())
}

export const populateDetail = (country: string) => {
    homeElem.classList.add('none')
    detailElem.classList.remove('none')

    const countryInfo = $appData.get().countries.find(c => c.name.toLowerCase() === country.toLowerCase())
    if (!countryInfo) throw Error('problem! country not in db!')

    detailElem.querySelector('h2')!.textContent = countryInfo?.name ?? ''
    detailElem.querySelector('img')!.src = countryInfo?.flag ?? ''
    detailElem.querySelector('img')!.alt = countryInfo?.name ?? ''
    detailElem.querySelector('.native-name span')!.textContent =  countryInfo?.nativeName ?? ''
    detailElem.querySelector('.population span')!.textContent = Intl.NumberFormat().format(countryInfo?.population) ?? ''
    detailElem.querySelector('.region span')!.textContent =  countryInfo?.region ?? ''
    detailElem.querySelector('.sub-region span')!.textContent =  countryInfo?.subregion ?? ''
    detailElem.querySelector('.capital span')!.textContent =  countryInfo?.capital ?? ''
    detailElem.querySelector('.domain span')!.textContent =  countryInfo?.topLevelDomain?.join(', ') ?? ''
    detailElem.querySelector('.currencies span')!.textContent =  countryInfo?.currencies?.map(c  => c.name).join(', ') ?? ''
    detailElem.querySelector('.languages span')!.textContent =  countryInfo?.languages?.map(c  => c.name).join(', ') ?? ''
    detailElem.querySelector('.border-bar')!.innerHTML = ``
    if (countryInfo.borders) {

        countryInfo.borders.forEach(border => {
            const cty = $appData.get().countries.find(c=>c.alpha3Code === border)!.name
            const el = document.createElement('a')
            el.href = `/countries/${cty}`
            el.textContent = cty
            
            detailElem.querySelector('.border-bar')!.appendChild(el)
        })
    }




}



$filtered.subscribe(val => {
    writeHomeMarkUp(val)
})




formElem.addEventListener('submit', e => { e.preventDefault() })
regionInput.addEventListener('change', _ => { $appData.setKey('region', regionInput.value.toLowerCase()) })
searchInput.addEventListener('input', _ => { $appData.setKey('search', searchInput.value.toLowerCase().trim()) })
themeBtn.addEventListener('click', _ => {
    const theme = $theme.get()
    const next = (theme === 'system') ? 'dark' : (theme === 'dark' ? 'light' : 'system');
    $theme.set(next)
})
topBtn?.addEventListener('click', _ => {
    scrollTo({
        'top': 0,
    })
})





