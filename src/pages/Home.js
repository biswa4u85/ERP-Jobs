import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosFetch from '../hooks/useAxiosFetch';
import { useLocalStorage } from "../hooks/useLocalStorage";

function Home() {
    let navigate = useNavigate();
    const [countrys, setCountrys] = useLocalStorage("countrys", []);
    const [selcountry, setSelcountry] = useLocalStorage("selcountry", "");

    const paramsCompany = `doctype=Job+Opening&limit_page_length=None&fields=${JSON.stringify(["company"])}&cmd=frappe.client.get_list`;
    const companyData = useAxiosFetch(paramsCompany);
    const [filtercountry, setFiltercountry] = useState([])

    const paramscountry = `doctype=Company&limit_page_length=None&filters=${JSON.stringify(filtercountry)}&fields=${JSON.stringify(["country"])}&cmd=frappe.client.get_list`;
    const countryData = useAxiosFetch(paramscountry);

    useEffect(() => {
        if (countryData.data) {
            let key = 'country';
            let countrys = [...new Map(countryData.data.map(item => [item[key], item])).values()]
            countrys.sort(function (a, b) {
                var textA = a.country.toUpperCase();
                var textB = b.country.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            setCountrys(countrys)
        }
    }, [countryData.data])

    useEffect(() => {
        if (companyData.data) {
            // let filtercountry = []
            // for (let item of companyData.data) {
            //     filtercountry.push(["Company", "name", "like", item.company])
            // }
            // setFiltercountry(filtercountry)
        }

    }, [companyData.data])

    return (
        <>
            <div id="titlebar" className="photo-bg">
                <div className="container">
                    <div className="sixteen columns">
                        <h2>Countrys</h2>
                    </div>
                </div>
            </div>

            <div className="container minHight">
                <div className="sixteen columns">
                    {/* <h3 className="margin-bottom-20 margin-top-10">Popular Countrys</h3> */}
                    <div className="categories-boxes-container">
                        {countrys.map((item, key) => <a key={key} to="/listing" onClick={() => {
                            setSelcountry(item.country)
                            setTimeout(() => navigate('/listing'), 0)

                        }} className={`category-small-box ${item.country == selcountry ? 'active' : ''}`}>
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <h4>{item.country}</h4>
                            {/* <span>{item.code}</span> */}
                        </a>)}
                    </div>
                    <div className="clearfix"></div>
                    <div className="margin-top-30"></div>
                    <div className="margin-bottom-55"></div>
                </div>
            </div>
        </>

    );
}

export default Home;