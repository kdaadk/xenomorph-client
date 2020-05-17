import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {ActivityMap} from "./ActivityMap"
import {getStreamBy} from "../shared/getStreamBy"
import api from "../api"
import {kalman} from "../shared/kalman"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import "../shared/stringExtensions"
import "../styles/DetailsModal.scss"
import {getSections} from "../shared/getSections"
import VelocityChart from "./VelocityChart"
import TextField from "@material-ui/core/TextField"
import SatisfactionRating from "./SatisfactionRating"
import SectionTable from "./SectionTable"
import {getAverageVelocity} from "../shared/getAverageVelocity"

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        height: 950,
        width: 950,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5]
    }
}))

const getStreams = async (id) => {
    const response = await api.getStream(id)
    return response.data.data
}

function DetailsModal(props) {
    const { openModal, setOpenModal, activity } = props
    const isRun = activity.type === 'Run'
    const [modalStyle] = React.useState(getModalStyle)
    const classes = useStyles()

    const [satisfaction, setSatisfaction] = React.useState(Number(activity.satisfaction))
    const [comment, setComment] = React.useState(Number(activity.comment))
    const [open, setOpen] = React.useState(Boolean(openModal))

    const handleClose = async () => {
        activity.comment = comment
        activity.satisfaction = satisfaction
        await api.updateActivity(activity)
            .then(() => {
                setOpenModal(false)
                setOpen(false)
                console.log('updated')
            })        
    }

    const handleCommentChange = (event) => setComment(event.currentTarget.value)
    
    const [streams, setStreams]= React.useState({
        loading: false,
        velocity: [],
        distance: [],
        sections: []        
    })

    useEffect(() => {
        const activityId = activity.stravaActivityId
        setStreams({ loading: true, distance: [], velocity: [], sections: [] })
        getStreams(activityId)
            .then(doc => {
                const time = getStreamBy("time", doc.streams)
                const velocity = kalman(getStreamBy("velocity_smooth", doc.streams))
                const distance = getStreamBy("distance", doc.streams)
                const sections = isRun ? getSections(velocity, distance, time) : []
                setStreams({
                    loading: false,
                    distance: distance,
                    velocity: velocity,
                    sections: sections})
            })
        }, []
    )

    const body = (
        <Fade in={open}>
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.root} id="details-modal-content">
                    <div className="row">
                        { (isRun && !streams.loading) && (
                            <SectionTable className="sections-table" sections={streams.sections} />
                        )}                        
                        <div className="map" style={{ width: isRun ? '74%' : '100%' }}>
                            <ActivityMap center={activity.startPoint} encodedRoute={activity.mapPolyline} />
                            <div className="main-info">
                                <span className="column">Avg speed: {getAverageVelocity(activity.distance, activity.time)}</span>
                                <span className="column">Distance: {activity.distance}</span>
                                <span className="column">Time: {activity.time.toString().toHHMMSS()}</span>
                            </div>
                            <div className="input-info">
                                <SatisfactionRating defaultValue={satisfaction} setValue={setSatisfaction} />
                                <TextField style={{ width: '70%', marginLeft: '5%'}} label="Comment" defaultValue={activity.comment} onChange={handleCommentChange}/>
                            </div>
                        </div>
                    </div>
                    
                    { !streams.loading && (
                        <VelocityChart className="chart" distance={streams.distance} velocity={streams.velocity} />
                    )}
                    
                </div>
            </div>
        </Fade>
    )

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            {body}
        </Modal>
    )
}

export { DetailsModal }