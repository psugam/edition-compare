import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminPage = () => {
  return (
    <>
      <div className="flex  flex-col justify-center">
        <Link to="/admin" className="ml-4 sm:ml-8 md:ml-12 lg:ml-20">
          Admin
        </Link>

        <Link to="/admin/add" className="ml-4 sm:ml-8 md:ml-12 lg:ml-20">
          Add Texts and Editions
        </Link>

        <Link to="/admin/texts" className="ml-4 sm:ml-8 md:ml-12 lg:ml-20">
          Edit Texts
        </Link>

        <Link to="/admin/editions" className="ml-4 sm:ml-8 md:ml-12 lg:ml-20">
          Edit Editions
        </Link>
      </div>
    </>
  );
};

export default AdminPage;
