import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const { isAuthenticated, admin, loading } = useContext(Context);
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments only after authentication
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://doctorathomeserver.vercel.app/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
        toast.error("Failed to load appointments");
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://doctorathomeserver.vercel.app/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
    }
  };

  // Prevent early redirect while auth is loading
  if (loading) {
    return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="dashboard page">
      {/* Banner */}
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="Doctor" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>
                {admin?.firstName} {admin?.lastName}
              </h5>
            </div>
            <p>
              Welcome back to the admin dashboard. Here you can manage doctors
              and appointments easily.
            </p>
          </div>
        </div>

        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{appointments.length}</h3>
        </div>

        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>10</h3>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="banner">
        <h5>Appointments</h5>

        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Visited</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    {appointment.firstName} {appointment.lastName}
                  </td>
                  <td>
                    {appointment.appointment_date?.substring(0, 16)}
                  </td>
                  <td>
                    {appointment.doctor?.firstName}{" "}
                    {appointment.doctor?.lastName}
                  </td>
                  <td>{appointment.department}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          appointment._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Appointments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
