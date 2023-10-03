import { Incident } from "./incident";
import clientPromise from "./mongodb";

async function addRecord(i: Incident) {
    const c = await clientPromise;
}

async function putRecord(i: Incident) {
    const c = await clientPromise;

}

async function delRecord(i: Incident) {
    const c = await clientPromise;
}

async function listRecord(): Promise<Incident[]> {
    const c = await clientPromise;

    return [];
}
