// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
// Mapbox Lib ->
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

// Basic Setup (to use mapbox)
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

// Sample Data ->
let hospitals = [
	'Pvt Dr Rakesh Multispeciality Hospital',
	'Pvt Mansaram Hospital, Nangloi',
	'Pvt C M PATEL HOSPITAL',
	'Pvt World Brain Center Hospital',
	'Pvt Fortis Hospital, Shalimar Bagh',
	'Delhi Govt Satyawati Harishchand Hsopital',
	'Pvt Satyabhama Hospital, Nangloi',
];
let address = [
	'Jawahar Lal Nehru Marg,Delhi.110002',
	'Model Town',
	'Saket',
	'Rohini',
	'Sarita Vihar',
	'Vasant Kunj',
	'Punjabi Bagh',
];
let phone = [
	9865341234,
	7653412345,
	8765432112,
	9734501821,
	7340501234,
	6783213451,
	5432186473,
];
let beds = [1, 0, 0, 0, 0, 0, 0];
let admits = ['50', '-', '50', '30', '-', '20', '50'];
let waiting = ['50-60', '-', '-', '50-60', '20-30', '-', '40-50'];
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
		};
		this.mapContainer = React.createRef();
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		const { lng, lat, zoom } = this.state;
		const map = new mapboxgl.Map({
			container: this.mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom,
		});

		// Store New Coordinates
		map.on('move', () => {
			this.setState({
				lng: map.getCenter().lng.toFixed(4),
				lat: map.getCenter().lat.toFixed(4),
				zoom: map.getZoom().toFixed(2),
			});
		});
	}

	handleClick = (divName) => {
		this.setState({
			activeDiv: divName,
		});
	};

	renderData = () => {
		let results = [];
		for (var i = 0; i < hospitals.length; i++) {
			const divName = 'd' + (i + 1);
			results.push(
				<div
					key={i}
					onClick={() => this.handleClick(divName)}
					className={this.state.activeDiv === divName ? 'dispBed pb-2' : 'pb-2'}
				>
					<p>
						<span>
							{hospitals[i]}
							<br />
						</span>
						{this.state.activeDiv === divName ? (
							<>
								<div>
									<i className='fas fa-map-marker-alt pr-2'></i>
									{address[i]}
								</div>
								<div>
									<i className='fas fa-phone-alt pr-1'></i>
									{phone[i]}
								</div>
							</>
						) : null}
					</p>
					<div className='row'>
						<div className='col-sm-4'>
							Available Beds
              				<div>
								{beds[i]}/150
							</div>
						</div>
						<div className='col-sm-4'>
							New Admits
    						<div>
								{admits[i]}/hr
							</div>
						</div>
						<div className='col-sm-4'>
							Patients Waiting
              				<div>
								{waiting[i]}
							</div>
						</div>
					</div>
					<div
						style={{ color: '#48B3BC', fontSize: '0.7em', paddingTop: '2px' }}
					>
						Verified 10 mins ago
          			</div>
					<hr />
				</div>
			);
		}
		return <>{results}</>;
	};
	render() {
		const { lng, lat, zoom } = this.state;
		return (
			<>
				<p className='sub-head'>Select to view availability</p>
				<button id='bedBtn' type='button' className='btn btn-light btn-sm'>
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
						<div id='map' ref={this.mapContainer} className='col-sm-9'>
							{/* Display Latitude and Longitude */}
							<div className='sidebar'>
								<span>Longitude: {lng}</span> | <span>Latitude: {lat}</span> |{' '}
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
