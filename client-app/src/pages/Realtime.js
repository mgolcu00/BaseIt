import React, { useEffect } from 'react'
import { Container, Row, Col, Card, Button, Dropdown, FormText } from 'react-bootstrap'
import ReactJson from 'react-json-view'
import "../components/style.css"
import constants from '../utils/constants'
import axios from 'axios'
import { RealtimeDatabaseClient } from '../components/Realtime'

const BASE_URL = constants.BASE_URL + '/realtime';
const exampleData = {
}
const base_16_themes = [
    'apathy',
    'ashes',
    'bespin',
    'brewer',
    'bright',
    'chalk',
    'codeschool',
    'colors',
    'eighties',
    'embers',
    'flat',
    'google',
    'grayscale',
    'greenscreen',
    'harmonic',
    'isotope',
    'marrakesh',
    'mocha',
    'monokai',
    'ocean',
    'paraiso',
    'pop',
    'railscasts',
    'shapeshifter',
    'solarized',
    'summerfruit',
    'tomorrow',
    'tube',
    'twilight',
]

function RealtimeInfo({ onClickCreateRealtime }) {
    return (
        <Container>
            <Row>
                <Col md={10} style={{ marginTop: '20px', borderBottom: '1px solid #ccc' }}>
                    <h1>Realtime Database</h1>
                    <h4>Store and sync data in real time</h4>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Card style={{ padding: '20px', marginTop: '20px', height: '100%' }}>
                        <Card.Body>
                            <Card.Text>Realtime Database, bulutta barındırılan bir veritabanıdır. Veriler JSON olarak depolanır ve bağlı her istemciyle gerçek zamanlı olarak senkronize edilir. Android ve JavaScript SDK'larımızla platformlar arası uygulamalar oluşturduğunuzda, tüm müşterileriniz bir Gerçek Zamanlı Veritabanı örneğini paylaşır ve en yeni verilerle güncellemeleri otomatik olarak alır. </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <div className="button-image">
                        <Button style={{ alignSelf: 'center', marginLeft: '60px' }} variant="primary" onClick={onClickCreateRealtime}>Gerçek Zamanlı Veri Tabanı Oluştur.</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{ marginTop: '40px' }}>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title>Nasıl Çalışır</Card.Title>
                            <Card.Subtitle>Gerçek zamanlı veri tabanı temel olarak bulutta bir postgresql database tabanında çalışır.</Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Veriler Web veya Mobil istemcilere SSE ve Kafka teknlojileri yardımıyla gönderilir.
                                <br />
                                Postgresql Database de değişiklik olduğu zaman Kafka bir olay üretir.
                                <br />
                                Üretilen olay istemci sunucusuna producer ile iletlir.
                                <br />
                                Sunucu consumer ile okuyup verileri kontrol eder.
                                <br />
                                Okuduğu verileri SSE ile istemciye gerçek zamanlı olarak gönderir.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title>Nasıl Kullanılır?</Card.Title>
                            <Card.Subtitle>NodeJS, ReactJS, <span style={{ color: '#00bcd4' }}>React Native</span> ve <span style={{ color: '#00bcd4' }}>Android</span> ile kullanılır.</Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Yakında eklenecek...
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

function RealtimeConfigBar({ isOnline, theme, setTheme }) {

    return (
        <Row md={2} style={{ margin: '20px 2px 2px 2px', padding: '20px', border: '1px solid #21325E', borderRadius: '10px' }}>
            <Col md={8} style={{ padding: '8px' }}>
                {isOnline ? <span style={{ color: '#019267' }}>ONLINE</span> : <span style={{ color: '#FF6363' }}>OFFLINE</span>}
            </Col>
            <Col md={2}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {theme}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {base_16_themes.map((item, index) => {
                            return (
                                <Dropdown.Item key={index} onClick={() => setTheme(item)}>{item}</Dropdown.Item>
                            )
                        })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    )
}


function fetchClientService(path) {
    return new Promise((resolve, reject) => {
        axios.get(BASE_URL + path)
            .then(response => {
                resolve(response);
            }
            )
            .catch(error => {
                reject(error);
            }
            );
    })
}

function postClientService(path, data) {
    return new Promise((resolve, reject) => {
        axios.post(BASE_URL + path, data)
            .then(response => {
                resolve(response);
            }
            )
            .catch(error => {
                reject(error);
            }
            );
    })
}


function Realtime() {
    const [data, setData] = React.useState(exampleData)
    const [isActive, setIsActive] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [theme, setTheme] = React.useState('monokai')
    const [isOnline, setIsOnline] = React.useState(false)

    const client = new RealtimeDatabaseClient();

    useEffect(() => {

        client.ref('*')
            .listen((err, data) => {
                if (err) {
                    setError(err.error)
                } else {
                    setData(data)
                    setIsActive(true)
                    setIsOnline(true)
                }
            })

        return () => {
            if (client)
                client.close();
        }

    }, [])

    function sendData(data) {
       client.ref('*').push(data)
    }

    if (error) {
        return <div>Error: {error}</div>
    }
    if (!isActive) {
        return <RealtimeInfo onClickCreateRealtime={
            () => {
                postClientService('/create')
                    .then(response => {
                        let data = response.data;
                        setData(data.data);
                        setIsOnline(true);
                        setIsActive(true)
                    })
                    .catch(err => {
                        setIsOnline(false)
                        setError(err)
                        setIsActive(false)
                    })
            }
        } />
    }

    if (loading) {
        return <div>Loading...</div>
    }



    const onEdit = (editData) => {
        sendData(editData.updated_src)
    }
    const onAdd = (addData) => {
        setData(addData.updated_src)
    }
    const onDelete = (deleteData) => {
        sendData(deleteData.updated_src)
    }

    return (
        <Container>
            <Col md={12}>
                <h2>Realtime Database</h2>
            </Col>

            <Col md={10} style={{ marginTop: '20px' }}>
                <RealtimeConfigBar theme={theme} setTheme={setTheme} isOnline={isOnline} setIsOnline={setIsOnline} />
                {isOnline &&
                    <ReactJson src={data}
                        enableClipboard={false}
                        onEdit={onEdit}
                        sortKeys={true}
                        onAdd={onAdd}
                        onDelete={onDelete}
                        theme={theme}
                        displayDataTypes={false}
                        style={{ padding: '60px', borderRadius: '10px' }}
                    />}
            </Col>
        </Container>
    )
}

export default Realtime
