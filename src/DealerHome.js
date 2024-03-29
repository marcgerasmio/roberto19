import './app.css';
import DealerNavbar from "./DealerNavbar.js";
import { Col, Row, Card, Container, Button, Form } from "react-bootstrap";
import supabase from './SupabaseClient.js';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function CompanyVehicles(){
    const [carData, setCarData] = useState(null);
    const [error] = useState(null);
    const dealerName = localStorage.getItem('dealer_name');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();;

    const handleLogin = useCallback(async () => {
        try {
            const { data } = await supabase
            .from('Vehicles')
            .select('*') 
            .eq('dealer_name', dealerName);
            setCarData(data);
        } 
        catch (error) {
            console.error('Error during login:', error.message);
        }
    }, [dealerName]); 

    useEffect(() => {
        handleLogin();
    }, [handleLogin]);

    const onClickBuyNow = (car) => {
        const { dealer_name, car_name, car_style, price, VIN, image_path, stocks } = car;
        localStorage.setItem('dealer_name', dealer_name);
        localStorage.setItem('car_name', car_name);
        localStorage.setItem('car_style', car_style);
        localStorage.setItem('price', price);
        localStorage.setItem('VIN', VIN);
        localStorage.setItem('image_path', image_path);
        localStorage.setItem('stocks', stocks);
        navigate('/dealerconfirm');
    };
    
    return (
        <>  
     <div style={{ display: 'flex', height: 'auto', overflow: 'scroll initial', backgroundColor:'#CCB3A3' }}>
    <DealerNavbar />

    {/* Main Content */}
    <div style={{ flex: 1, padding: '20px' }}>
        {error && <p>{error}</p>}
        {carData && (
            <Container className='flexcon mt-4'>
                {carData.filter(car => car.car_name.toLowerCase().includes(searchTerm.toLowerCase())).map((car) => (
                    <CarCard key={car.vin} car={car} onClickBuyNow={onClickBuyNow} />
                ))}
            </Container>
        )}
    </div>
</div>
        </>
    );
};
    
function CarCard({ car, onClickBuyNow }) {
    const {car_name, price, image_path, stocks} = car;
    const handleBuyNowClick = () => {
        onClickBuyNow(car);
    };
    
    return (
        <>
        <Container>
            <Card style={{ 
                maxWidth: '540px', 
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                padding: '20px 10px'
            }}>
                <Row>
                    <Col sm={7}>
                        <Card.Img src={image_path} className="card-image" />
                    </Col>
                    <Col sm={5}>
                        <Card.Title className="mt-2">{car_name}</Card.Title>
                        <Card.Text>Price: {price}<br/>Stocks: {stocks}</Card.Text>
                        <Button 
                       style={{backgroundColor:'#A67B5B', borderColor:'white'}}
                            className="check-out" 
                            onClick={handleBuyNowClick}
                        >
                            Buy Now
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Container>
        </>
      );
}

export default CompanyVehicles;