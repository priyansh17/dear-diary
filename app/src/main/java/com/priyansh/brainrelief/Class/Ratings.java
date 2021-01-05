package com.priyansh.brainrelief.Class;

public class Ratings {
    private Float rate;
    private String name;
    private String number;

    public Ratings(Float rate, String name, String number) {
        this.rate = rate;
        this.name = name;
        this.number = number;
    }

    public Float getRate() {
        return rate;
    }

    public void setRate(Float rate) {
        this.rate = rate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
