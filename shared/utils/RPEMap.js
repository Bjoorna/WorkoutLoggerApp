class RPEMap {

    constructor(isInit = false, rpeMap = new Map()){
        this.isInit = isInit;
        this.rpeMap = rpeMap;
    }
    
    initRPEMap() {
        const rpevalues = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
        const intensity10 = [100, 96, 92, 89, 86, 84, 81, 79, 76, 74];
        const intensity95 = [98, 94, 91, 88, 85, 82, 80, 77, 75, 72];
        const intensity9 = [96, 92, 89, 86, 84, 81, 79, 76, 74, 71];
        const intensity85 = [94, 91, 88, 85, 82, 80, 77, 75, 72, 69];
        const intensity8 = [92, 89, 86, 84, 81, 79, 76, 74, 71, 68];
        const intensity75 = [91, 88, 85, 82, 80, 77, 75, 72, 69, 67];
        const intensity7 = [89, 86, 84, 81, 79, 76, 74, 71, 68, 65];
        const intensity65 = [88, 85, 82, 80, 77, 75, 72, 69, 67, 64];
        this.rpeMap.set(rpevalues[0], intensity65);
        this.rpeMap.set(rpevalues[1], intensity7);
        this.rpeMap.set(rpevalues[2], intensity75);
        this.rpeMap.set(rpevalues[3], intensity8);
        this.rpeMap.set(rpevalues[4], intensity85);
        this.rpeMap.set(rpevalues[5], intensity9);
        this.rpeMap.set(rpevalues[6], intensity95);
        this.rpeMap.set(rpevalues[7], intensity10);
        this.isInit = true;
    }

    getIntensity(rpe, reps){
        if(!this.isInit){
            this.initRPEMap();
        }
        const intensity = this.rpeMap.get(rpe)[reps-1];
        return intensity;
    }
}

export default RPEMap;