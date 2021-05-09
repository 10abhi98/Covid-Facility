// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
import { firestore } from '../services/Firebase';
// Mapbox Lib ->
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

// Basic Setup (to use mapbox)
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
var marker = new mapboxgl.Marker();
// Sample Data ->

// End sample data
class homepage extends Component {
    constructor(props) {
        super(props);
        // Set Initial Coordinates
        this.state = {
            lng: 77.21,
            lat: 28.64,
            zoom: 9,
            activeDiv: null,
            locationData: [],
            wait: false,
            map: '',
        };
        this.mapContainer = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        // this.getLocData = this.getLocData.bind(this);
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
        });

        this.setState({
            map: map,
        });

        // Store New Coordinates
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
        });

        // Fetch Data from Firestore Database ->
        const locationDocument = firestore
            .collection('locations')
            .orderBy('Tasks_Info.Beds.Count', 'desc');
        locationDocument.onSnapshot((snapshot) => {
            let locData = [];
            snapshot.forEach((doc) => {
                locData.push(doc.data());
            });
            this.setState({
                locationData: locData,
            });
        });
    }

    handleClick = (divName, longitude, latitude) => {
        marker.remove();
        this.setState({
            activeDiv: divName,
        });
        marker.setLngLat([longitude, latitude]).addTo(this.state.map);
        // var popup = new mapboxgl.Popup({ closeButton: false }).setText(
        //     locationName
        // );
        // const element = marker.getElement();
        // element.id = 'marker';
        // element.addEventListener('mouseenter', () =>
        //     popup.addTo(this.state.map)
        // );
        // element.addEventListener('mouseleave', () => popup.remove());
        // marker.setPopup(popup);
        // marker.addTo(this.state.map);
    };

    renderData = () => {
        return this.state.locationData.map((loc, index) => {
            const hospitalName = loc['Name'];
            //  loc['Coordinates']['Lat']
            const address =
                (loc['Address']['Street']
                    ? loc['Address']['Street'] + ','
                    : '') +
                (loc['Address']['City'] ? loc['Address']['City'] + ',' : '') +
                (loc['Address']['State']
                    ? loc['Address']['State']
                    : 'New Delhi') +
                (loc['Address']['Pincode']
                    ? '-' + loc['Address']['Pincode']
                    : '');
            const contact =
                loc['Contact'][0] +
                (loc['Contact'][1] ? ', ' + loc['Contact'][1] : '');
            const divName = 'd' + (index + 1);
            const availableBeds =
                loc['Tasks_Info']['Beds']['Count'] !== 0
                    ? loc['Tasks_Info']['Beds']['Count']
                    : '-';
            const totalBeds = loc['Total_Beds'];
            const newPatients =
                loc['Tasks_Info']['New_Patients']['Count'] !== 0
                    ? loc['Tasks_Info']['New_Patients']['Count']
                    : '-';
            const waitingPatients =
                loc['Tasks_Info']['Waiting_Patients']['Count'] !== 0
                    ? loc['Tasks_Info']['Waiting_Patients']['Count']
                    : '-';
            return (
                <div
                    key={index}
                    onClick={() =>
                        this.handleClick(
                            divName,
                            loc['Coordinates']['_long'],
                            loc['Coordinates']['_lat']
                        )
                    }
                    className={
                        this.state.activeDiv === divName
                            ? 'dispBed pb-2'
                            : 'pb-2'
                    }
                >
                    <p>
                        <span>
                            {hospitalName}
                            <br />
                        </span>
                        {this.state.activeDiv === divName ? (
                            <>
                                <div>
                                    <i className='fas fa-map-marker-alt pr-2'></i>
                                    {address}
                                </div>
                                <div>
                                    <i className='fas fa-phone-alt pr-1'></i>
                                    {contact}
                                </div>
                            </>
                        ) : null}
                    </p>
                    <div className='row'>
                        <div className='col-sm-4'>
                            Available Beds
                            <div>
                                {availableBeds}/{totalBeds}
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            New Admits
                            <div>{newPatients}/hr</div>
                        </div>
                        <div className='col-sm-4'>
                            Patients Waiting
                            <div>{waitingPatients}</div>
                        </div>
                    </div>
                    <div
                        style={{
                            color: '#48B3BC',
                            fontSize: '0.7em',
                            paddingTop: '2px',
                        }}
                    >
                        Verified 10 mins ago
                    </div>
                    <hr />
                </div>
            );
        });
        // let results = [];
        // for (var i = 0; i < hospitals.length; i++) {
        //     const divName = "d" + (i + 1);
        //     results.push(
        //         <div
        //             key={i}
        //             onClick={() => this.handleClick(divName)}
        //             className={
        //                 this.state.activeDiv === divName
        //                     ? "dispBed pb-2"
        //                     : "pb-2"
        //             }
        //         >
        //             <p>
        //                 <span>
        //                     {hospitals[i]}
        //                     <br />
        //                 </span>
        //                 {this.state.activeDiv === divName ? (
        //                     <>
        //                         <div>
        //                             <i className='fas fa-map-marker-alt pr-2'></i>
        //                             {address[i]}
        //                         </div>
        //                         <div>
        //                             <i className='fas fa-phone-alt pr-1'></i>
        //                             {phone[i]}
        //                         </div>
        //                     </>
        //                 ) : null}
        //             </p>
        //             <div className='row'>
        //                 <div className='col-sm-4'>
        //                     Available Beds
        //                     <div>{beds[i]}/150</div>
        //                 </div>
        //                 <div className='col-sm-4'>
        //                     New Admits
        //                     <div>{admits[i]}/hr</div>
        //                 </div>
        //                 <div className='col-sm-4'>
        //                     Patients Waiting
        //                     <div>{waiting[i]}</div>
        //                 </div>
        //             </div>
        //             <div
        //                 style={{
        //                     color: "#48B3BC",
        //                     fontSize: "0.7em",
        //                     paddingTop: "2px",
        //                 }}
        //             >
        //                 Verified 10 mins ago
        //             </div>
        //             <hr />
        //         </div>
        //     );
        // }
        // return <>{results}</>;
    };
    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <>
                <p className='sub-head'>Select to view availability</p>
                <button
                    id='bedBtn'
                    type='button'
                    className='btn btn-light btn-sm'
                >
                    Beds
                </button>
                <div className='container-fluid'>
                    <div className='row'>
                        {/* Hospitals with Details */}
                        <div id='beds' className='col-sm-3'>
                            <p className='p1'>
                                Results
                                <span className='float-right'>
                                    Sort by: Available Beds
                                </span>
                            </p>
                            <div>
                                <div id='scr' className='scrollbar'>
                                    {this.renderData()}
                                </div>
                            </div>
                        </div>
                        {/* MapBox */}
                        <div
                            id='map'
                            ref={this.mapContainer}
                            className='col-sm-9'
                        >
                            {/* Display Latitude and Longitude */}
                            <div className='sidebar'>
                                <span>Longitude: {lng}</span> |{' '}
                                <span>Latitude: {lat}</span> |{' '}
                                <span>Zoom: {zoom}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default homepage;
