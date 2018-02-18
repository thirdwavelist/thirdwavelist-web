import React, { Component } from 'react';
import { invokeApig } from '../libs/awsLib'
import { Button, Col } from 'reactstrap';
import Columns from 'react-bulma-components/lib/components/columns';
import config from '../config';
import mapboxgl from 'mapbox-gl';
import './CafeDetail.css';

mapboxgl.accessToken = config.mapboxgl.ACCESS_TOKEN

export default class CafeDetail extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        cord_lat: "47.493755", // TODO: Remove hardcoded value
        cord_lng: "19.060109", // TODO: Remove hardcoded value
        cafe: null
      }
    }

    async componentDidMount() {
        try {
            const cafeId = this.props.location.state.cafeId
            const cafeCallResponse = await this.cafeById(cafeId);
            this.setState({ cafe: cafeCallResponse });
        } catch (e) {
            var pathSegments = this.props.location.pathname.split('/');
            const cafeName = pathSegments[1]
            const cityName = pathSegments[2]
            const cafeCallResponse = await this.cafeByName(cafeName, cityName);
            this.setState({ cafe: cafeCallResponse });
        }
    
        this.setState({ isLoading: false });
    }

    toggleFullscreen() {
        console.log("fullscreen mode toggled");
    }

    cafeById(cafeId) {
        return invokeApig({
            path: "/cafe/"+cafeId,
            method: "GET",
            headers: { "x-api-key": config.apiGateway.API_KEY }
        });
    }
    
    cafeByName(cafeName, cityName) {
        return invokeApig({
            path: "/"+cityName+"/"+cafeName,
            method: "GET",
            headers: { "x-api-key": config.apiGateway.API_KEY }
        });
    }

    render() {
        return(
            <div>
                <div className="mapContainer">
                    <div className="map" ref={(x) => { this.container = x }} onClick={this.toggleFullscreen}/>
                    {!this.state.isLoading && this.renderMapData(this.state.cafe)}
                </div>
                {!this.state.isLoading && this.renderCafeDetails(this.state.cafe)}
            </div>
        )
    }

    renderMapData(cafe) {
        var lat = this.state.cord_lat;
        var lng = this.state.cord_lng;
        const mapContainer = <div className="absolute top right left bottom" />;
        const map = new mapboxgl.Map({
            container: this.container,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            zoom: 14,
            interactive: false
        });
        var marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);

        return <Button id="direction-button" color="primary" target="_blank" href={"https://www.google.com/maps/search/?api=1&query="+ cafe.city +"&query_place_id="+ cafe.extra_google_placeid}><span>Directions</span></Button>
    }

    renderCafeDetails(cafe) {
        return (
            <div>
                <span className="title">{cafe.name}</span>
                <span className="subtitle">{cafe.city}, {cafe.address}</span>
                <span className="social">
                    {(cafe.social_instagram) ? <a className="fa fa-facebook-square" target="_blank" href={cafe.social_facebook}/> : null}
                    {(cafe.social_instagram) ? <a className="fa fa-instagram" target="_blank" href={cafe.social_instagram}/> : null}
                </span>
                <br />
                <Columns breakpoint="desktop">
                    <Col lg="6">
                        <div className="left"> 
                            <span className="header">Gear</span>
                            <br />
                            {this.getEspresso(cafe)}
                            {this.getGrinder(cafe)}
                            {this.getFullImmersion(cafe)}
                            {this.getPourOver(cafe)}
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="right">
                            <span className="header">Bean</span>
                            <br />
                            <div><span className="floatLeft"><b>Roaster(s) </b></span> <span className="floatRight">{cafe.bean_roaster}</span></div>
                            <div><span className="floatLeft"><b>Profile </b></span> <span className="floatRight">{this.getRoastProfile(cafe)}</span></div>
                            <div><span className="floatLeft"><b>Origin </b></span> <span className="floatRight">{this.getOrigin(cafe)}</span></div>
                        </div>
                    </Col>
                </Columns>
                <br />
            </div>
        )
    }

    getRoastProfile(cafe) {
        var results = []
        if (cafe.bean_roast_light) results.push("Light")
        if (cafe.bean_roast_medium) results.push("Medium")
        if (cafe.bean_roast_dark) results.push("Dark")
        
        if (results.length <= 1) {
            return results.join();
        } else {
            return results.slice(0, -1).join(", ") + " and " + results[results.length-1];
        }
    }

    getOrigin(cafe) {
        if (cafe.bean_origin_single && cafe.bean_origin_blend) return "Single & Blend" 
        else if (cafe.bean_origin_single) return "Single"
        else if (cafe.bean_origin_blend) return "Blend"
        else return "Unknown"
    }

    getGrinder(cafe) {
        if (cafe.gear_grinder !== null && cafe.gear_grinder.length > 1) {
            return <div><span className="floatLeft"><b>Grinder </b></span> <span className="floatRight">{cafe.gear_grinder}</span></div>
        }
    }
    
    getEspresso(cafe) {
        if (cafe.brew_method_espresso && cafe.gear_espressomachine !== null && cafe.gear_espressomachine.length > 1) {
            return <div><span className="floatLeft"><b>Espresso </b></span> <span className="floatRight">{cafe.gear_espressomachine}</span></div>
        }
        return
    }

    getPourOver(cafe) {
        if (cafe.brew_method_pourover) {
            return <div><span className="floatLeft"><b>Pour-over </b></span> <span className="floatRight">{cafe.gear_pourover}</span></div>
        }
    }

    getFullImmersion(cafe) {
        if (cafe.brew_method_fullimmersion) {
            return <div><span className="floatLeft"><b>Immersive </b></span> <span className="floatRight"> {cafe.gear_immersive}</span></div>
        }
        return;
    }
}