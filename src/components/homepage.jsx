// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
import { analytics, firestore } from '../services/Firebase';
import moment from 'moment';

// Mapbox Lib ->
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

// Basic Setup (to use mapbox)
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
var marker = new mapboxgl.Marker();

class homepage extends Component {
    _isMounted = false;
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
            inputValue: '',
        };

        // Create Reference ->
        this.mapContainer = React.createRef();

        // Bind Functions ->
        this.locationSearchHandler = this.locationSearchHandler.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderData = this.renderData.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        analytics.logEvent('visited_homepage');
        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

        this.setState({
            map: map,
        });

        // Store New Coordinates
        map.on('move', () => {
            if (this._isMounted) {
                this.setState({
                    lng: map.getCenter().lng.toFixed(4),
                    lat: map.getCenter().lat.toFixed(4),
                    zoom: map.getZoom().toFixed(2),
                });
            }
        });

        // Fetch Data from Firestore Database ->
        const locationDocument = firestore.collection('locations');
        locationDocument
            .orderBy('Tasks_Info.Beds.Count', 'desc')
            .onSnapshot((snapshot) => {
                let locData = [];
                snapshot.forEach((doc) => {
                    locData.push(doc.data());
                });
                if (this._isMounted) {
                    this.setState({
                        locationData: locData,
                    });
                }
            });
    }

    // Prevent Memeory Leak ->
    componentWillUnmount() {
        this._isMounted = false;
    }

    // Location Search Holder ->
    locationSearchHandler = (e) => {
        this.setState({
            inputValue: e.target.value,
        });
    };

    // Submit Button Handler ->
    handleClick = (divName, locationName, longitude, latitude) => {
        marker.remove();
        this.setState({
            activeDiv: divName,
        });
        marker.setPopup(
            new mapboxgl.Popup({
                closeButton: false,
                className: 'popup',
            })
                .setText(locationName)
                .setMaxWidth('500px')
                .trackPointer()
        );
        marker.setLngLat([longitude, latitude]).addTo(this.state.map);
    };

    // Display Hospital Data Handler ->
    renderData = (filteredLocation) => {
        return filteredLocation.map((loc, index) => {
            const divName = 'd' + (index + 1);
            const hospitalName = loc['Name'];
            //  loc['Coordinates']['Lat']
            const address = (
                <a href={`${loc['Map_Link']}`} target='_blank' rel='noreferrer'>
                    {(loc['Address']['Street']
                        ? loc['Address']['Street'] + ', '
                        : '') +
                        (loc['Address']['City']
                            ? loc['Address']['City'] + ', '
                            : '') +
                        (loc['Address']['State']
                            ? loc['Address']['State']
                            : 'New Delhi') +
                        (loc['Address']['Pincode']
                            ? '-' + loc['Address']['Pincode']
                            : '')}
                </a>
            );
            const contact = (
                <>
                    <a href={`tel:${loc['Contact'][0]}`}>{loc['Contact'][0]}</a>
                    {loc['Contact'][1] && (
                        <>
                            ,{' '}
                            <a href={`tel:${loc['Contact'][1]}`}>
                                {loc['Contact'][1]}
                            </a>
                        </>
                    )}
                </>
            );
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
                    className={
                        this.state.activeDiv === divName
                            ? 'dispBed'
                            : 'notdispBed'
                    }
                    onClick={() =>
                        this.handleClick(
                            divName,
                            hospitalName,
                            loc['Coordinates']['_long'],
                            loc['Coordinates']['_lat']
                        )
                    }
                >
                    <div className='availabilityInfo'>
                        <div className='hospitalTile'>
                            <p>{hospitalName}</p>

                            <div className='verification'>
                                <p>
                                    Verified by call{' '}
                                    {moment(
                                        new Date(
                                            loc['Tasks_Info']['Beds'][
                                                'Verified_At'
                                            ].seconds * 1000
                                        )
                                    ).fromNow()}
                                </p>
                            </div>
                        </div>
                        <div className='figures'>
                            <p className='figure'>
                                {availableBeds}/<wbr />
                                {totalBeds}
                            </p>
                            <p className='figure'>{newPatients}/hr</p>
                            <p className='figure'>{waitingPatients}</p>
                        </div>
                    </div>
                    {this.state.activeDiv === divName ? (
                        <>
                            <p className='infoPhone'>{contact}</p>
                            <p className='infoAddress'>{address}</p>
                        </>
                    ) : null}
                </div>
            );
        });
    };

    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <>
                {/* Categoraization */}
                {/* <h6 className='sub-head'>Select to view availability</h6>
                <button
                    id='bedBtn'
                    type='button'
                    className='btn btn-light btn-sm'
                >
                    Beds
                </button> */}

                {/* Search Bar */}
                <input
                    type='text'
                    id='searchBar'
                    className='form-control mt-2'
                    placeholder='Search'
                    value={this.state.inputValue}
                    onChange={this.locationSearchHandler}
                />
                {/* <i className="fal fa-search float-right"></i> */}

                <div className='container-fluid'>
                    <div className='row'>
                        {/* Hospitals with Details */}
                        <div id='beds' className='sidebar'>
                            {/* Columns */}
                            <div className='results'>
                                <p
                                    style={{
                                        width: 50 + '%',
                                        display: 'inline-block',
                                    }}
                                >
                                    Hospitals
                                </p>
                                <p
                                    style={{
                                        width: 16.66 + '%',
                                        display: 'inline-block',
                                    }}
                                >
                                    Beds
                                </p>
                                <p
                                    style={{
                                        width: 16.66 + '%',
                                        display: 'inline-block',
                                    }}
                                >
                                    Admits
                                </p>
                                <p
                                    style={{
                                        width: 16.66 + '%',
                                        display: 'inline-block',
                                    }}
                                >
                                    Waiting
                                </p>
                            </div>

                            {/* Hospital List */}
                            <div>
                                <div id='scr' className='scrollbar'>
                                    <>
                                        {this.renderData(
                                            this.state.locationData.filter(
                                                (loc) =>
                                                    loc['Name']
                                                        .toLowerCase()
                                                        .includes(
                                                            this.state.inputValue.toLowerCase()
                                                        )
                                            )
                                        )}
                                    </>
                                </div>
                            </div>
                        </div>

                        {/* MapBox */}
                        <div id='map' ref={this.mapContainer} className='maps'>
                            {/* Display Latitude and Longitude */}
                            <div className='mapDetails'>
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
