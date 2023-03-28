import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Form, Input, Button } from 'antd';
import { fileUpload } from '../common/apis'
import { useLocalStorage } from "../hooks/useLocalStorage";
import useAxiosFetch from '../hooks/useAxiosFetch';
import useAxiosPost from '../hooks/useAxiosPost';
import config from '../common/config';
import { toast } from 'react-toastify';
const { TextArea } = Input;

function Details() {
    let { id } = useParams();
    const pageActive = useRef(false);
    const [selcountry, setSelcountry] = useLocalStorage("selcountry", "");
    const [detail, setDetail] = useState({})
    const [formValues, setFormValues] = useState(null)
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState(false)

    let params = `doctype=Job+Opening&limit_page_length=None&filters=${JSON.stringify([["Job Opening", "name", "=", id]])}&fields=${JSON.stringify(["*"])}&cmd=frappe.client.get_list`;
    const { data, fetchError, isLoading } = useAxiosFetch(params);
    useEffect(() => {
        setDetail(data ? data[0] : {});
    }, [data])

    const [open, setOpen] = useState(false);
    const [res, apiMethod] = useAxiosPost({ doctype: 'Job Applicant', data: formValues });
    useEffect(() => {
        if (res && res.data && pageActive.current) {
            toast('Application apply successfully')
            pageActive.current = false
        }
    }, [res])

    const onFinish = (values) => {
        if (!file) {
            setFileError(true)
            return false
        }
        let formValues = {
            "job_title": detail.name,
            "applicant_name": values.fullName,
            "email_id": values.email,
            "phone_number": values.phone,
            "country": selcountry,
            "company": detail.company,
            "cover_letter": values.message,
            "resume_attachment": file,
            "currency": detail.currency,
            "lower_range": detail.lower_range,
            "upper_range": detail.upper_range
        }
        setFormValues(formValues)
        setOpen(false)
        pageActive.current = true
    };


    const uploadFile = async (event) => {
        let data = await fileUpload(event.target.files[0], window?.frappe?.csrf_token)
        if (data.message) {
            let file = `${data.message.file_url}`
            setFile(file)
            setFileError(false)
        }
    }

    return (
        <>
            <div id="titlebar" style={{ padding: 1, margin: 0 }}>

            </div>

            <div className="container minHight" style={{ marginTop: 20, minHeight: "82vh" }}>

                <div className="eleven columns">
                    <div className="padding-right">

                        <div className="company-info">
                            {detail?.image && (<img src={config.apiURL + detail?.image} alt="" />)}
                            <div className="content">
                                <h1>{detail?.job_title}</h1>
                                <span><i class="fa fa-transgender-alt" aria-hidden="true"></i> {detail?.designation}</span>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: detail?.description ? detail?.description : ' ' }}></div>

                    </div>
                </div>



                <div className="five columns">


                    <div className="widget">
                        <h4>Overview</h4>

                        <div className="job-overview">

                            <ul>
                                <li>
                                    <i class="fa fa-building" aria-hidden="true"></i>
                                    <div>
                                        <strong>Company:</strong>
                                        <span>{detail?.company}</span>
                                    </div>
                                </li>
                                {/* <li>
                                    <i class="fa fa-ticket" aria-hidden="true"></i>
                                    <div>
                                        <strong>Job Title:</strong>
                                        <span>{detail?.job_title}</span>
                                    </div>
                                </li> */}
                                {(detail?.publish_salary_range == 1) && (<li>
                                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                                    <div>
                                        <strong>Salary:</strong>
                                        <span>{detail?.currency} {detail?.lower_range} - {detail?.upper_range}</span>
                                    </div>
                                </li>)}

                                <li>
                                    <i class="fa fa-deviantart" aria-hidden="true"></i>
                                    <div>
                                        <strong>Department:</strong>
                                        <span>{detail?.department}</span>
                                    </div>
                                </li>
                                {/* <li>
                                    <i className="fa fa-money"></i>
                                    <div>
                                        <strong>Staffing Plan:</strong>
                                        <span>{detail?.lower_range} - {detail?.upper_range}</span>
                                    </div>
                                </li> */}
                            </ul>
                            <a onClick={() => setOpen(true)} className="popup-with-zoom-anim button">Apply For This Job</a>
                            <Modal
                                title="Apply For This Job"
                                centered
                                open={open}
                                onOk={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                footer={null}>
                                <div id="small-dialog" className="zoom-anim-dialog apply-popup">
                                    <div className="small-dialog-content">

                                        <Form
                                            name="basic"
                                            onFinish={onFinish}
                                            autoComplete="off"
                                        >
                                            <Form.Item
                                                name="fullName"
                                                rules={[{ required: true, message: 'Please input your Full Name!' }]}
                                            >
                                                <Input placeholder="Full Name" />
                                            </Form.Item>

                                            <Form.Item
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Please input your Email Address!' },
                                                    {
                                                        pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                                                        message: 'Please input a valid Email Address!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Email Address" />
                                            </Form.Item>

                                            <Form.Item
                                                name="phone"
                                                rules={[
                                                    { required: true, message: 'Please input your Phone Number!' },
                                                    {
                                                        pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                                        message: 'Please input a valid Phone Number!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Phone Number" />
                                            </Form.Item>

                                            <Form.Item
                                                name="message"
                                                rules={[{ required: true, message: 'Please input your Your message!' }]}
                                            >
                                                <TextArea rows={4} placeholder="Your message / cover letter sent to the employer" />
                                            </Form.Item>

                                            <Form.Item
                                                name="file"
                                            >
                                                <div className="upload-info"><strong>Upload your CV</strong> <span>Max. file
                                                    size: 5MB</span></div>
                                                <div className="clearfix"></div>
                                                <label className="upload-btn">
                                                    <input type="file" onChange={uploadFile} />
                                                    <i className="fa fa-upload"></i> Browse
                                                </label>
                                                <span className="fake-input">No file selected</span>
                                            </Form.Item>
                                            {fileError && (<div id="basic_phone_help" class="ant-form-item-explain ant-form-item-explain-connected" role="alert"><div class="ant-form-item-explain-error">Please Upload your CV!</div></div>)}

                                            <div className="divider"></div>

                                            <Form.Item>
                                                <button type="submit" className="send">Send Application</button>
                                            </Form.Item>
                                        </Form>

                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Details;