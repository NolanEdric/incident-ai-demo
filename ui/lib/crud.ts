import { Collection, ObjectId } from "mongodb";
import { Incident } from "./incident";
import clientPromise from "./mongodb";
import del from 'delete';
import { audio_storage_path, db_collection, db_name } from "./check-env";

async function db_col(): Promise<Collection<Document>> {
  const p = await clientPromise;
  const db = await p.connect();
  return db.db(db_name).collection(db_collection);
}

export async function addRecord(): Promise<Incident | undefined> {
  try {
    const i = new Incident();
    const c = await db_col();
    const res = await c.insertOne({
      title: i.title || "Untitled",
      concernType: i.concernType || "Unsafe Act",
      nearMissType: i.nearMissType || "Near Miss",
      audio: i.audio,
      dateTime: i.dateTime || new Date().toISOString(),
      inference: i.inference,
    });
    i.id = res.insertedId.toHexString();
    return i;
  } catch (e) {
    console.log("crud Add record: " + e);
  }
}

export async function updateRecord(i: Incident): Promise<any> {
  try {
    const c = await db_col();
    const findRes = await c.findOne({ _id: new ObjectId(i.id) });
    if (findRes) {
      const updateRes = await c.updateOne(
        { _id: new ObjectId(i.id) },
        {
          $set: {
            audio: i.audio,
            title: i.title,
            concernType: i.concernType,
            nearMissType: i.nearMissType,
            dateTime: i.dateTime,
            inference: i.inference
          }
        }
      );
      return updateRes;
    }
    return findRes;
  } catch (e) {
    console.log("crud update record" + e);
  }
}

export async function getRecord(id: string | null): Promise<Incident | undefined> {
  try {
    if (id) {
      const c = await db_col();
      const res = await c.findOne({ _id: new ObjectId(id) });
      if (res) {
        const i = new Incident();
        i.id = id;
        i.audio = res.audio;
        i.title = res.title;
        i.concernType = res.concernType;
        i.nearMissType = res.nearMissType;
        i.dateTime = res.dateTime;
        i.inference = res.inference;
        return i;
      }
    }
  } catch (e) {
    console.log("crud get record:"+ e);
  }
}

export async function delRecord(id: string): Promise<any> {
  try {
    const c = await db_col();
    const findRes = await c.findOne({ _id: new ObjectId(id) });
    if (findRes) {
      const delRes = await c.deleteOne({ _id: new ObjectId(id) });
      await del([`${audio_storage_path}/${id}.*`], function (err: any, deleted: any) {
        if (err) throw err;
        // deleted files
        // console.log(deleted);
      });
      return delRes;
    }
    return findRes;
  } catch (e) {
    console.log("crud del record:" + e);
  }
}

export async function listRecord(): Promise<Incident[]> {
  let l: Incident[] = [];
  try {
    const c = await db_col();
    const res = await c.find({}).toArray();
    res.forEach((r: any) => {
      const i = new Incident();
      i.id = r._id.toHexString();
      i.audio = r.audio;
      i.title = r.title;
      i.concernType = r.concernType;
      i.nearMissType = r.nearMissType;
      i.dateTime = r.dateTime;
      i.inference = r.inference;
      l.push(i);
    });
  } catch (e) {
    console.log("crud list record: " + e);
  }
  return l;
}
