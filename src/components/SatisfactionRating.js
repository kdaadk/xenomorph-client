import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import React from "react";
import Rating from "@material-ui/lab/Rating";

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

export default function SatisfactionRating(props) {
    const [satisfaction, setSatisfaction] = React.useState(Number(props.defaultValue));
    const handleSatisfactionChange = (event) => {
        setSatisfaction(event.currentTarget.value);
        props.setValue(event.currentTarget.value);
    }

    return (
        <Rating
            style={{marginTop: 16}}
            name="customized-icons"
            defaultValue={satisfaction}
            getLabelText={(value) => customIcons[value].label}
            onChange={handleSatisfactionChange}
            IconContainerComponent={IconContainer}
        />
    )
}