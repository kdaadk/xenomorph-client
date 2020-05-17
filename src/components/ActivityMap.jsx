import React, { Component } from 'react'
import {Map, Polyline, TileLayer} from 'react-leaflet';
import '../styles/ActivityMap.scss'
import {getBounds} from "../shared/getBounds";
const polyUtil = require('polyline-encoded');

class ActivityMap extends Component{
    state = {
        center: this.props.center,
        polyline: [],
        bounds: [],
        zoom: 16
    };

    decodeToPolyline = (encodedRoute) => polyUtil.decode(encodedRoute);
    
    componentDidMount(){
        const polyline = this.props.polyline || this.decodeToPolyline(this.props.encodedRoute);
        this.setState({polyline:polyline});
        
        const bounds = getBounds(polyline);
        this.setState({bounds:bounds});
    }    

    render() {
        const { center, zoom, bounds, polyline } = this.state;
        
        return (
            <Map ref='map' center={center} zoom={zoom} {...(bounds.length !== 0 ? {"bounds": bounds} : {})}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline ref='polyline' color="#3f51b5" positions={polyline} />
            </Map>
        )
    }
}

export { ActivityMap }