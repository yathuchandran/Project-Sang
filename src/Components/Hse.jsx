import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";

function Hse() {
  const [project, setProject] = useState([]);
  const [projectCode, setprojectCode] = useState();
  const [triger, setTriger] = useState(new Date());
  const [datalist, setDataList] = useState();
  const [actionBy, setActionBy] = useState();
  const [EmpCode, setEmpCode] = useState();
  const [showPopup, setShowPopup] = useState(false);
  console.log(showPopup, 19);
  const handleAddCondition = (e) => {
    e.preventDefault(); // Prevent the form submission or page refresh
    setShowPopup(true);
  };

  const [formDatas, setFormData] = useState({
    iTransId: 7312,
    DocDate: "",
    Project: 0,
    ProjectDes: "",
    Location: "",
    UserId: 0,
    Signature: "sign121617042162023.jpg",
    body: [],
  });
  const [formBody, setFormBody] = useState({
    Observation: "",
    RiskLevel: 0,
    ActionReq: "",
    ActionBy: 0,
    TargetDate: "",
    Images:
      "121336042132023.jpg;121516042152023.jpg;121522042152023.jpg;121530042152023.jpg",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formDatas, [name]: value });
  };

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setFormBody({ ...formBody, [name]: value });
    setprojectCode(value.iId);
  };

  const handleActionBy = (event) => {
    const value = JSON.parse(event.target.value);
    setFormBody({
      ...formBody,
      ["ActionBy"]: value.iId,
      ["TargetDate"]: formDatas.DocDate,
    });
    setEmpCode(value.sCode);
  };

  //project description---------------------
  const prjctDec = async (e) => {
    try {
      const value = e.target.value;
      const res = await axios.get(
        `http://103.120.178.195/HSEAPI/Ray/GetProjectDescription?iProject=${value}`
      );
      const decvaluess = JSON.parse(res.data.ResultData);
      setFormData({
        ...formDatas,
        ["ProjectDes"]: decvaluess[0].sDescription,
        ["Project"]: value,
      });
    } catch (error) {}
  };

  const Risklevel = ["Low ", "Medium", "High"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    formDatas.body.push(formBody);
    const formDataObject = new FormData();
    formDataObject.append("Body", JSON.stringify(formDatas));
    console.log(formDataObject, "formDataObject", 89);
    try {
      const res = await axios.post(
        "http://103.120.178.195/HSEAPI/Ray/PostHSE",
        formDataObject
      );
      console.log(res.data, "res.data", 95);
      setTriger(new Date());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const projectFetch = async () => {
      try {
        const res = await axios.get(
          "http://103.120.178.195/HSEAPI/Ray/GetProject"
        );
        setProject(JSON.parse(res.data.ResultData));
      } catch (error) {
        console.log(error);
      }
    };

    projectFetch();
  }, []);

  //TABLE DATASSSSSS-----------------

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get(
          `http://103.120.178.195/HSEAPI/Ray/GetHSEDetails?iTransId=${7312}`
        );
        const tablevalue = JSON.parse(res.data.ResultData);
        console.log(
          tablevalue.Body,
          "125bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        );
        setDataList(tablevalue.Body);
      } catch (error) {
        console.log(error);
      }
    };

    getList();
  }, [triger]);

  useEffect(() => {
    const getEmp = async () => {
      try {
        const res = await axios.get(
          "http://103.120.178.195/HSEAPI/Ray/GetEmployee"
        );
        const result = await res.data;
        console.log(
          res.data.ResultData,
          126,
          "----------------------------------------------------"
        );
        setActionBy(JSON.parse(res.data.ResultData));
      } catch (error) {
        console.log(error);
      }
    };
    getEmp();
  }, []);

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <FontAwesomeIcon icon={faEdit} onClick={() => row} />
          <span> </span>
          <FontAwesomeIcon icon={faTrash} onClick={() => row} />
        </div>
      ),
    },
    {
      name: "SL NO",
      selector: (row, index) => index + 1,
    },
    {
      name: "Observations/Findings",
      selector: (row) => row.sObservation,
    },
    {
      name: "Risk Level",
      selector: (row) => {
        if (row.iRiskLevel === 1) {
          return "Low";
        } else if (row.iRiskLevel === 2) {
          return "Medium";
        } else if (row.iRiskLevel === 3) {
          return "High";
        }
      },

    },
    {
      name: "ActionBy",
      selector: (row) => row.sActionBy,
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, rgb(240, 230, 245), #99ccff)",
      }}
    >
      <div className="row">
        <form
          className="mx-auto w-75 setProfile"
          encType="multipart/form-data"
          style={{
            background:
              "linear-gradient(to bottom, rgb(220, 210, 225), #66a3ff)",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="text-center text-bold mb-3 mt-3">
            <h1 style={{ fontFamily: "Times New Roman, serif" }}>
              HSE Observation Form
            </h1>
          </div>
          <Row className="pr-0 justify-content-center">
            <Col sm={4}>
              <label for="project">Project</label>:
              <select
                name="Project"
                id="Project"
                className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                // value={formDatas.Project}
                onChange={prjctDec}
              >
                <option value="">Select a Project</option>
                {project &&
                  project.map((el, index) => (
                    <option key={el.iId} value={el.iId}>
                      {el.sName}
                    </option>
                  ))}
              </select>
              <label for="projectDetails">Project Details</label>:
              <input
                className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                type="text"
                id="ProjectDes"
                name="ProjectDes"
                value={formDatas.ProjectDes}
              />
            </Col>
            <Col sm={4}>
              <label for="location">Location</label>:
              <input
                className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                type="text"
                id="Location"
                name="Location"
                value={formDatas.Location}
                onChange={handleInputChange}
              />
              <label for="date">Date</label>
              <input
                className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                type="date"
                id="DocDate"
                value={formDatas.DocDate}
                name="DocDate"
                onChange={handleInputChange}
              />
            </Col>

            <Col
              sm={8}
              className="mt-4 m-5 mb-0"
              style={{ paddingLeft: "250px" }}
            >
              <button onClick={handleAddCondition} className="btn btn-primary">
                Add General Condition
              </button>
            </Col>

            <div
              className="posission-relative"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPopup && (
                <div className="popup posision-absolute">
                  {/* Your popup form code goes here */}
                  <Row className="pr-0 justify-content-center">
                  <Col sm={4} className="mt-4">
                    <label for="Observation/findings">
                      Observation/findings
                    </label>
                    <input
                      className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      type="text"
                      id="Observation"
                      name="Observation"
                      value={formBody.Observation}
                      onChange={handleInputChanges}
                    />
                  </Col>
                  <Col sm={4} className="mt-4">
                    <label for="riskLevel">Risk Level</label>
                    <select
                      name="RiskLevel"
                      id="RiskLevel"
                      className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      value={formBody.RiskLevel}
                      onChange={handleInputChanges}
                    >
                      <option value="">(Risk Level)</option>
                      {Risklevel.map((item, index) => (
                        <option key={index} value={index + 1}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col sm={4} className="mt-4">
                    <label for="Actionrequired">Action required</label>
                    <input
                      className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      type="text"
                      id="ActionReq"
                      name="ActionReq"
                      value={formBody.ActionReq}
                      onChange={handleInputChanges}
                    />
                  </Col>
                  <Col sm={4} className="mt-4">
                    <label for="actionBy">Action By</label>
                    <select
                      name="ActionBy"
                      id="ActionBy"
                      className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      value={"ActionBy"}
                      onChange={handleActionBy}
                    >
                      <option value="">(Action By)</option>
                      {actionBy &&
                        actionBy?.map((el, index) => (
                          <option key={el.iId} value={JSON.stringify(el)}>
                            {el.sName}
                          </option>
                        ))}
                    </select>
                  </Col>
                  <Col sm={4} className="mt-4">
                    <label for="Employee">Employee code</label>
                    <input
                      className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      type="text"
                      id="sCode"
                      name="sCode"
                      value={EmpCode}
                    />
                  </Col>
                  <Col sm={4} className="mt-4">
                    <label for="targetDate">Target Date</label>
                    <input
                      className="form-control dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      type="date"
                      id="TargetDate"
                      name="TargetDate"
                      value={formBody.TargetDate}
                      onChange={handleInputChanges}
                    />
                  </Col>
                  </Row>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn  btn-primary mt-3 mb-2"
              style={{ width: "25%" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </Row>
          <DataTable columns={columns} title="Table" data={datalist} />
        </form>
      </div>
    </div>
  );
}

export default Hse;
