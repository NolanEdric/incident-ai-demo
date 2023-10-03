export class Incident {
  id                      : string;
  dateTime              ! : string | null;
  nearMissType          ! : string | null;
  concernType           ! : string | null;
  audio                 ! : string | null;
  inference             ! : string | null;
  constructor(id: string) {
    this.id               = id;
  }
}
