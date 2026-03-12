import './Ongkiroffer.css';
import Card from '../productcard/Productcard'

export default function Ongkiroffer({}){
    return (
        <div className="offer-container">
            <div className="list-container">
                <div className="freeong-banner">
                    <img src="asset/images/free-dev.png" width="70"/>
                    <h1>Gratis Ongkir</h1>
                    <p>Lebih hemat<br/>dengan promo<br/> gratis ongkir</p>
                </div>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
        </div>
    )
}