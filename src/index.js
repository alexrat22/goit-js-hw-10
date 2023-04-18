import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  oneCountryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(evt) {
  if (evt.target.value.trim() === '') {
    return;
  } else {
    fetchCountries(refs.inputField.value.trim())
      .then(response => {
        if (response.length === 1) {
          refs.countryList.innerHTML = '';
          refs.oneCountryInfo.innerHTML = createOneCountryInfo(response[0]);
        } else if (response.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          refs.countryList.innerHTML = '';
          refs.oneCountryInfo.innerHTML = '';
        } else {
          refs.countryList.innerHTML = createCountries(response);
          refs.oneCountryInfo.innerHTML = '';
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        refs.countryList.innerHTML = '';
        refs.oneCountryInfo.innerHTML = '';
      });
  }
}

function createCountries(countries) {
  return countries
    .map(country => {
      return `<li class="country-flag-title">
    <img class="country-flag" src='${country.flags.svg}' alt="flag of ${country.flags.alt}" width=25/>
    ${country.name.official}
    </li>`;
    })
    .join('');
}

function createOneCountryInfo(country) {
  return `<div class="country-flag-title">
    <img class="country-flag" src='${country.flags.svg}' alt="flag of ${
    country.flags.alt
  }" width=35 height=25>
    <h1 class = "country-title">${country.name.official}</h1></div>
    <p><b>Capital: </b>${country.capital}</p>
    <p><b>Population: </b>${country.population}</p>
    <p><b>Languages: </b>${Object.values(country.languages)}</p>`;
}
