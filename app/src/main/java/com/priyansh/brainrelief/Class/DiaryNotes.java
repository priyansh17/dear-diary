package com.priyansh.brainrelief.Class;

public class DiaryNotes {
    private String Entry;
    private String Id;

    public DiaryNotes(String entry, String id) {
        Entry = entry;
        Id = id;
    }

    public String getEntry() {
        return Entry;
    }

    public void setEntry(String entry) {
        Entry = entry;
    }

    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }
}
