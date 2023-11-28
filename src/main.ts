import { loadAppData, populateDetail, populateHome } from './markUp';
import './scss/index.scss';
import { $router } from './store';



$router.subscribe(async(page) => {
    try {
        await loadAppData();
        if (page?.route === 'home') { populateHome() }
        else if(page?.route === 'detail') {  populateDetail(page.params.name) }
        else { throw Error('something went wrong!') }
    }
    catch(e) {
        if (page?.route === 'home') return 
        window.location.href = '/'
    }
})


export {}