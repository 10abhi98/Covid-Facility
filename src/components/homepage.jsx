// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import { firestore } from "../services/Firebase";
import moment from "moment";

// Mapbox Lib ->
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";

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
            inputValue: ''
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
        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom,
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

        this.setState({
            map: map,
        });

        // Store New Coordinates
        map.on("move", () => {
            if (this._isMounted) {
                this.setState({
                    lng: map.getCenter().lng.toFixed(4),
                    lat: map.getCenter().lat.toFixed(4),
                    zoom: map.getZoom().toFixed(2),
                });
            }
        });

        // Fetch Data from Firestore Database ->
        const locationDocument = firestore
            .collection("locations")
            .orderBy("Tasks_Info.Beds.Count", "desc");
        locationDocument.onSnapshot((snapshot) => {
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
                className: "popup",
            })
                .setText(locationName)
                .setMaxWidth("500px")
                .trackPointer()
        );
        marker.setLngLat([longitude, latitude]).addTo(this.state.map);
    };

    // Display Hospital Data Handler ->
    renderData = (filteredLocation) => {
        return filteredLocation.map((loc, index) => {
            const divName = "d" + (index + 1);
            const hospitalName = loc["Name"];
            //  loc['Coordinates']['Lat']
            const address =
                (loc["Address"]["Street"]
                    ? loc["Address"]["Street"] + ", "
                    : "") +
                (loc["Address"]["City"] ? loc["Address"]["City"] + ", " : "") +
                (loc["Address"]["State"]
                    ? loc["Address"]["State"]
                    : "New Delhi") +
                (loc["Address"]["Pincode"]
                    ? "-" + loc["Address"]["Pincode"]
                    : "");
            const contact =
                loc["Contact"][0] +
                (loc["Contact"][1] ? ", " + loc["Contact"][1] : "");
            const availableBeds =
                loc["Tasks_Info"]["Beds"]["Count"] !== 0
                    ? loc["Tasks_Info"]["Beds"]["Count"]
                    : "-";
            const totalBeds = loc["Total_Beds"];
            const newPatients =
                loc["Tasks_Info"]["New_Patients"]["Count"] !== 0
                    ? loc["Tasks_Info"]["New_Patients"]["Count"]
                    : "-";
            const waitingPatients =
                loc["Tasks_Info"]["Waiting_Patients"]["Count"] !== 0
                    ? loc["Tasks_Info"]["Waiting_Patients"]["Count"]
                    : "-";
            return (
                <div
                    key={index}
                    onClick={() =>
                        this.handleClick(
                            divName,
                            hospitalName,
                            loc["Coordinates"]["_long"],
                            loc["Coordinates"]["_lat"]
                        )
                    }
                    className={
                        this.state.activeDiv === divName
                            ? "dispBed pb-2 pl-3"
                            : "pb-2 pl-3"
                    }
                >
                    <div className='basicInfo'>
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
                    </div>
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
                            color: "#48B3BC",
                            fontSize: "0.7em",
                            paddingTop: "2px",
                        }}
                    >
                        <em>
                            Verified{" "}
                            {moment(
                                new Date(
                                    loc["Tasks_Info"]["Beds"]["Verified_At"]
                                        .seconds * 1000
                                )
                            ).fromNow()}
                        </em>
                    </div>
                    <hr />
                </div>
            );
        });
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
                            <p className='p1 pl-3'>
                                Results
                                <span className='float-right'>
                                    Sort by: Available Beds
                                </span>
                            </p>
                            {/* Search Bar */}
                            <input
                                type='text'
                                id='searchBar'
                                className='form-control mt-2'
                                placeholder='Search'
                                value={this.state.inputValue}
                                onChange={this.locationSearchHandler}
                            />
                            <i className="fal fa-search float-right"></i>
                            {/* Hospital List */}
                            <div>
                                <div id='scr' className='scrollbar'>
                                    <>
                                    {this.renderData(
                                        this.state.locationData.filter((loc) =>
                                        loc['Name']
                                            .toLowerCase()
                                            .includes(this.state.inputValue.toLowerCase())
                                        )
                                    )}
                                    </>
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
                                <span>Longitude: {lng}</span> |{" "}
                                <span>Latitude: {lat}</span> |{" "}
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
