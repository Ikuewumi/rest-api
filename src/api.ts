
export const getData = async () => {
    const res = await fetch('/data.json')
    const json = await res.json() as CountryInfo[]

    return json
}