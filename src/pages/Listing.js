import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Checkbox, Divider } from 'antd';
import useAxiosFetch from '../hooks/useAxiosFetch';
import { useLocalStorage } from "../hooks/useLocalStorage";
import config from '../common/config';
const CheckboxGroup = Checkbox.Group;

function Listing() {
    const [countrys, setCountrys] = useLocalStorage("countrys", []);
    const [selcountry, setSelcountry] = useLocalStorage("selcountry", "");

    const jobTypes = ['Full-Time', "Part-Time", "Internship", "Freelance"]
    const [checkedList, setCheckedList] = useState([]);
    const onChange = (list) => {
        setCheckedList(list);
    };

    const [companys, setCompanys] = useState([])
    const [selcompany, setSelcompany] = useState('all')
    const [jobs, setJobs] = useState([])
    const [search, setSearch] = useState('')

    let paramsCompany = `doctype=Company&limit_page_length=None&filters=${JSON.stringify([["Company", "country", "=", selcountry]])}&fields=${JSON.stringify(["name", "company_name"])}&cmd=frappe.client.get_list`;
    const company = useAxiosFetch(paramsCompany);
    let filters = [["Job Opening", "status", "=", "Open"]]
    if (selcompany && selcompany != 'all') {
        filters.push(["Job Opening", "company", "=", selcompany])
    }

    let orFilters = []
    if (checkedList.length > 0) {
        for (let item of checkedList) {
            orFilters.push(["Job Opening", "job_type", "=", item])
        }
    }
    if (search) {
        orFilters.push(["Job Opening", "job_title", "like", `%${search}%`])
    }
    if (selcompany == 'all') {
        for (let company of companys) {
            orFilters.push(["Job Opening", "company", "=", company.name])
        }
    }
    let params = `doctype=Job+Opening&limit_page_length=None&filters=${JSON.stringify(filters)}&or_filters=${JSON.stringify(orFilters)}&fields=${JSON.stringify(["name", "image", "job_title", "job_type", "currency", "designation", "company", "lower_range", "upper_range"])}&cmd=frappe.client.get_list`;
    const { data, fetchError, isLoading } = useAxiosFetch(params);

    useEffect(() => {
        if (company.data) {
            setCompanys(company.data);
            // if (company.data && company.data[0]) {
            //     setSelcompany(company.data[0].name)
            // }
        }
    }, [company])

    useEffect(() => {
        if (data) {
            setJobs(data);
        }
    }, [data])

    return (
        <>
            <div id="titlebar" className="photo-bg">
                <div className="container">
                    <div className="sixteen columns">
                        <h2>We found {jobs?.length} jobs matching</h2>
                        {/* <h2>Popular Jobs</h2> */}
                    </div>
                </div>
            </div>


            <div className="container minHight">

                <div className="five columns">

                    <div className="widget">
                        <h4>Search By</h4>
                        <input type="text" placeholder="Search" value={search} onChange={(obj) => setSearch(obj.target.value)} />
                    </div>

                    <div className="widget">
                        <h4>Country</h4>
                        <select data-placeholder="Choose Country" className="chosen-select" onChange={(obj) => setSelcountry(obj.target.value)}>
                            {countrys.map((item) => <option key={item.country} selected={item.country == selcountry ? 'selected' : ''} value={item.country}>{item.country}</option>)}
                        </select>
                    </div>

                    <div className="widget">
                        <h4>Unit</h4>
                        <select data-placeholder="Choose Unit" className="chosen-select-no-single" onChange={(obj) => setSelcompany(obj.target.value)}>
                            <option selected={'all' == selcountry ? 'selected' : ''} key={'all'} value={'all'}>All</option>
                            {companys.map((item) => <option key={item.name} selected={item.name == selcountry ? 'selected' : ''} value={item.name}>{item.company_name}</option>)}
                        </select>
                    </div>


                    <div className="widget">
                        <h4>Job Type</h4>
                        <div className="checkboxesNew">
                            <CheckboxGroup options={jobTypes} value={checkedList} onChange={onChange} />
                        </div>

                        {/* <ul className="checkboxes">
                            <Checkbox.Group onChange={onChange}>
                                {jobTypes.map((item) => <li key={item}><Checkbox value={item}>{item}</Checkbox></li>)}
                            </Checkbox.Group>

                            <li>
                                <input id="check-1" type="checkbox" name="check" value="check-1" checked />
                                <label for="check-1">Any Type</label>
                            </li>
                        </ul> */}

                    </div>


                </div>

                <div className="eleven columns">
                    <div className="padding-right">

                        <div className="listings-container">

                            {jobs.map((item, key) => <NavLink key={key} to={`/details/${item.name}`} className={`listing ${item.job_type}`}>
                                <div className="listing-logo">
                                    {item?.image && (<img src={config.apiURL + item?.image} alt="" />)}
                                </div>
                                <div className="listing-title">
                                    <h4>{item.job_title} {item.job_type && (<span className="listing-type">{item.job_type}</span>)}</h4>
                                    <ul className="listing-icons">
                                        <li><i class="fa fa-transgender-alt" aria-hidden="true"></i> {item?.designation}</li>
                                        <li><i class="fa fa-map-o" aria-hidden="true"></i> {item?.company}</li>
                                        <li><i class="fa fa-credit-card" aria-hidden="true"></i> {item?.currency} {item?.lower_range} - {item?.upper_range}</li>
                                        {/* <li>
                                            <div className="listing-date new">new</div>
                                        </li> */}
                                    </ul>
                                </div>
                            </NavLink>)}


                        </div>
                        <div className="clearfix"></div>

                        {/* <div className="pagination-container">
                            <nav className="pagination">
                                <ul>
                                    <li><a href="browse-jobs.html#" className="current-page">1</a></li>
                                    <li><a href="browse-jobs.html#">2</a></li>
                                    <li><a href="browse-jobs.html#">3</a></li>
                                    <li className="blank">...</li>
                                    <li><a href="browse-jobs.html#">22</a></li>
                                </ul>
                            </nav>

                            <nav className="pagination-next-prev">
                                <ul>
                                    <li><a href="browse-jobs.html#" className="prev">Previous</a></li>
                                    <li><a href="browse-jobs.html#" className="next">Next</a></li>
                                </ul>
                            </nav>
                        </div> */}

                    </div>
                </div>







            </div>
        </>

    );
}

export default Listing;