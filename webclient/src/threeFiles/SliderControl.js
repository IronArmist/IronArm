import { ONE_DEGREE } from '../settings.js';

export default class SliderControl {

    constructor(RobotArm) {
        this.RobotArm = RobotArm;
        this.sliderModule = this.createSliderModule();
        this.sliderSections = this.createSliders();
    };

    createSliderModule() {
        const sliderModule = document.createElement('div');
        sliderModule.classList.add('slider-module');
        document.body.appendChild(sliderModule);
        return sliderModule;
    }

    createSliderSection(segment) {
        let label = segment.name;
        let value = segment.destinationValue;

        const sliderSection = document.createElement('div');
        sliderSection.classList.add('slider-section')

        const valueBox = document.createElement('h5');
        valueBox.innerHTML = this.createLabel(label, value);
        valueBox.classList.add('slider-value-box')
        sliderSection.appendChild(valueBox);

        const inputRange = document.createElement('input');
        inputRange.type = 'range';
        inputRange.step = '0.25';
        inputRange.min = '-180';
        inputRange.max = '180';
        inputRange.value = value;
        inputRange.classList.add('slider');

        inputRange.oninput = () => {
            segment.destinationValue = inputRange.value * ONE_DEGREE;
            segment.isActive = true;
            valueBox.innerHTML = this.createLabel(label, inputRange.value);
        }

        sliderSection.appendChild(inputRange);
        return sliderSection;
    }

    createSliderSectionGripper(gripper) {
        let label = gripper.name;
        let value = gripper.destinationValue;

        const sliderSection = document.createElement('div');
        sliderSection.classList.add('slider-section')
        const valueBox = document.createElement('h5');
        valueBox.innerHTML = this.createLabel(label, value);
        valueBox.classList.add('slider-value-box')
        sliderSection.appendChild(valueBox);

        const inputRange = document.createElement('input');
        inputRange.type = 'range';
        inputRange.step = '0.25';
        inputRange.min = '0';
        inputRange.max = '45';
        inputRange.value = value;
        inputRange.classList.add('slider');

        inputRange.oninput = () => {
            gripper.destinationValue = inputRange.value * ONE_DEGREE;
            gripper.isActive = true;
            valueBox.innerHTML = this.createLabel(label, inputRange.value);
        }

        sliderSection.appendChild(inputRange);
        return sliderSection;
    }

    createLabel = (label, value) => {
        return label + ": " + value + "°";
    }

    createSliders = () => {
        this.RobotArm.segments.forEach(segment => {
            this.sliderModule.appendChild(this.createSliderSection(segment));
        });
        this.RobotArm.grippers.forEach(gripper => {
            this.sliderModule.appendChild(this.createSliderSectionGripper(gripper));
        })
    };

};