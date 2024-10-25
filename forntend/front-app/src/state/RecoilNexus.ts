import { RecoilValue,RecoilState,useRecoilCallback } from 'recoil';

//Nexusインターフェースの定義 フックスを利用しないで状態を操作するための方法
export interface Nexus {
    get?:<T>(atom:RecoilValue<T>) => T;
    getPromise?:<T>(atom:RecoilValue<T>) => Promise<T>;
    set?:<T>(atom:RecoilState<T>,valorUpdater:T|((currVal:T) => T)) => void;
    reset?:(atom:RecoilState<any>) => void;
}

const nexus: Nexus ={};

export default function RecoilNexus() {
    nexus.get = useRecoilCallback(({snapshot})=>(atom)=> snapshot.getLoadable(atom).contents,[]);
    nexus.getPromise = useRecoilCallback(({snapshot})=> 
        <T>(atom: RecoilValue<T>) => snapshot.getPromise(atom).then(value => value as T), // 型をTにキャスト
    []);
    nexus.set = useRecoilCallback(({set}) => 
        <T>(atom: RecoilState<T>, valorUpdater: T | ((currVal: T) => T)) => 
            set(atom, valorUpdater), 
    []);
    nexus.reset = useRecoilCallback(({reset}) => reset,[]);
    return null;
}


export function getRecoil<T>(atom:RecoilValue<T>):T {
    return nexus.get!(atom);
}

export function getRecoilPromise<T>(atom:RecoilValue<T>) : Promise<T> {
    return nexus.getPromise!(atom);
}

export function setRecoil<T>(atom:RecoilState<T>,valorUpdater:T|((currVal:T)=>T)){
    nexus.set!(atom,valorUpdater);
}

export function resetRecoil(atom:RecoilState<any>){
    nexus.reset!(atom);
}



