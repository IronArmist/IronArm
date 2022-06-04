import { ONE_DEGREE } from '../settings';

export default class InstructionModule {

    constructor(RobotArm, runInstructionCycle) {
        this.RobotArm = RobotArm;
        this.instructionModule = this.createInstructionModule();
        this.instructionControls;
        this.instructionSections = [];
        this.addInstructionSection();
        this.createInstructionControls();
    };

    createInstructionModule = () => {

        const instructionModule = document.createElement('div');
        instructionModule.classList.add('instruction-module');
        document.body.appendChild(instructionModule);

        const instructionModuleHeader = document.createElement('div');
        instructionModuleHeader.classList.add('instruction-module-header')
        this.RobotArm.segments.forEach(segment => {
            const labelBox = document.createElement('h5');
            labelBox.classList.add('instruction-module-label')
            labelBox.innerHTML = segment.name;
            instructionModuleHeader.appendChild(labelBox);

            const labelBoxDescription = document.createElement('div');
            labelBox.classList.add('instruction-module-description')
            labelBoxDescription.innerHTML = "-180° to 180°";
            labelBox.appendChild(labelBoxDescription);
        });

        const labelBoxGripper = document.createElement('h5');
        labelBoxGripper.classList.add('instruction-module-label')
        labelBoxGripper.innerHTML = "Gripper";
        instructionModuleHeader.appendChild(labelBoxGripper);

        const labelBoxGripperDescription = document.createElement('div');
        labelBoxGripperDescription.classList.add('instruction-module-description')
        labelBoxGripperDescription.innerHTML = "0° to 45°";
        labelBoxGripper.appendChild(labelBoxGripperDescription);

        instructionModule.appendChild(instructionModuleHeader);
        return instructionModule;
    }

    instructionBox = (segment) => {
        let value = 0;
        const inputNumber = document.createElement('input');
        inputNumber.type = 'number';
        inputNumber.step = '0.25';
        inputNumber.min = '-180';
        inputNumber.max = '180';
        inputNumber.value = value;
        inputNumber.classList.add('instruction-section-input');
        return inputNumber;
    }

    instructionBoxGripper = (gripper) => {
        let value = 0;
        const inputNumber = document.createElement('input');
        inputNumber.type = 'number';
        inputNumber.step = '0.25';
        inputNumber.min = '0';
        inputNumber.max = '45';
        inputNumber.value = value;
        inputNumber.classList.add('instruction-section-input');
        return inputNumber;
    }


    addInstructionSection = () => {
        const instructionSection = document.createElement('div');
        instructionSection.classList.add('instruction-section');

        this.RobotArm.segments.forEach(segment => {
            instructionSection.appendChild(this.instructionBox(segment));
        });
        instructionSection.appendChild(this.instructionBoxGripper(this.RobotArm.grippers[0]));


        this.instructionModule.appendChild(instructionSection);
        this.instructionSections.push(instructionSection);
        return instructionSection;
    };

    removeInstructionSection = () => {
        const instructionSectionToRemove = this.instructionSections[this.instructionSections.length - 1];
        this.instructionModule.removeChild(instructionSectionToRemove);
        this.instructionSections.pop();
        return instructionSection;
    };


    createInstructionControls = () => {
        const instructionControls = document.createElement('div');
        instructionControls.classList.add('instruction-controls');
        this.instructionModule.appendChild(instructionControls);
        this.instructionControls = instructionControls;

        const runInstructionCycleBtn = document.createElement('button');
        runInstructionCycleBtn.classList.add('instruction-module-btn');
        runInstructionCycleBtn.classList.add('start-btn');
        runInstructionCycleBtn.innerHTML = 'Start!';
        runInstructionCycleBtn.onclick = () => { this.startInstructionCycle() };
        instructionControls.appendChild(runInstructionCycleBtn);
    }

    startInstructionCycle = () => {
        let instructionCount = 0;
        let allInstructionsDone = false;

        let isActiveArray = this.RobotArm.segments.map(segment => segment.isActive);
        isActiveArray.push(this.RobotArm.grippers[0].isActive);

        for (instructionCount; instructionCount < this.instructionSections.length; instructionCount++) {
            console.log(this.instructionSections[instructionCount])
            this.instructionSections[instructionCount].classList.add('is-active');
            for (let i = 0; i < this.RobotArm.segments.length; i++) {
                this.RobotArm.segments[i].destinationValue = this.instructionSections[instructionCount].children[i].value * ONE_DEGREE;
                this.RobotArm.segments[i].isActive = true;
                isActiveArray = this.RobotArm.segments.map(segment => segment.isActive);
            }
            this.RobotArm.grippers[0].destinationValue = this.instructionSections[instructionCount].children[this.instructionSections[instructionCount].children.length - 1].value * ONE_DEGREE;
            this.RobotArm.grippers[0].isActive = true;
            isActiveArray[isActiveArray.length - 1] = this.RobotArm.grippers[0].isActive;
            console.log("bong")

            console.log(this.instructionSections[instructionCount].children[this.instructionSections[instructionCount].children.length - 1].value);
        }
    }

};