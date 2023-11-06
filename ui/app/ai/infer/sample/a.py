from pprint import pprint

def read_text(file_path):
    with open(file_path, mode="r", encoding="utf-8") as fi:
        text = fi.read()
        return text

def read_ann_ner_file(file_path):
    data = []
    with open(file_path, mode="r", encoding="utf-8") as fi:
        for line in fi:
            seqs = line.strip().split("\t")
            if len(seqs) != 3:
                print(seqs)
            
            _id, type_start_end, text = seqs
            type, start_end_list = type_start_end.split(" ",maxsplit=1)
            start_end_first = start_end_list.split(";")[0]
            start, end = start_end_first.split()
            data.append({
                "_id": _id,
                "type": type,
                "start": int(start),
                "end": int(end),
                "text": text,
            })
    data = sorted(data, key=lambda item: item["start"])
    return data

if __name__ == "__main__":

    text = read_text("text.txt")
    ann_ner_list = read_ann_ner_file("ner.txt")
    ann_ce_list = read_ann_ner_file("ce.txt")

    
    for i, ann in enumerate(ann_ner_list + ann_ce_list):
        # reassign id
        ann["_id"] = f"T{i+1}"
        ann_start = ann["start"]
        ann_end = ann["end"]
        extracted_text = text[ann_start:ann_end]
        assert extracted_text == ann["text"]
        pprint(ann)

