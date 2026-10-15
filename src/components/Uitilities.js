import React from 'react'
import swal from 'sweetalert2';


function swalIsLoading(header) {
    let title = header ? header : 'Please wait'

    swal.fire({
        title: title,
        allowOutsideClick: false,
        timer: 2000
    })
    swal.showLoading()
}

function swalSuccess(header, description) {
    let title = header ? header : 'Success'
    let text = description ? description : ''

    return swal.fire({
        confirmButtonColor: "#24948B",
        title: title,
        text: text,
        icon: 'success',
        allowOutsideClick: false,
    })
}

function swalError(header, description) {
    let title = header ? header : 'Error'
    let text = description ? description : ''

    return swal.fire({
        confirmButtonColor: "#ff0e0e",
        title: title,
        text: text,
        icon: 'error',
        allowOutsideClick: false,
    })
}

function convertToFarenheit(tempInKelvin) {
    var tempInF = (tempInKelvin - 273.15) * 1.8 + 32;
    return tempInF.toFixed(2);
}

const stateOptions = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];

export {
    swalIsLoading,
    swalSuccess,
    swalError,
    convertToFarenheit,
    stateOptions
};