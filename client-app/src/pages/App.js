import React from 'react'
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaGem, FaDatabase } from 'react-icons/fa'
import 'react-pro-sidebar/dist/css/styles.css';
import { Row, Col, Container } from 'react-bootstrap'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Realtime from './Realtime'
import Dashboard from './Dashboard';



function App() {
    return (
        <div>
            <Router>
                <Row >
                    <Col xl="auto">
                        <ProSidebar style={{ height: '100vh' }} breakPoint="xl">
                            <Menu iconShape="square">
                                <MenuItem icon={<FaGem />}>Dashboard<Link to="/" /></MenuItem>
                                <MenuItem icon={<FaDatabase />}>Realtime Database<Link to="/realtime" /></MenuItem>
                            </Menu>
                        </ProSidebar>
                    </Col>
                    <Col xl="9">
                        <Routes>
                            <Route path="/" exact element={<Dashboard />} />
                            <Route path="/realtime" element={<Realtime />} />
                        </Routes>
                    </Col>
                </Row>
            </Router>
        </div>
    )
}

export default App
