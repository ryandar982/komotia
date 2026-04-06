import React, { useState } from 'react';
import UserMain from '../components/userdashboard/UserMain';
import NavDashboard from '../components/navbar/NavDashboard';

const UserDashboard = () => {
    const [search, setSearch] = useState("");

    return (
        <>
            <NavDashboard/>
            <UserMain />
        </>
    );
}

export default UserDashboard;