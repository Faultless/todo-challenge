var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

/** Import Todo model for unit testing */
var Todo = require('../server/models/todo');

describe("Get all todos", function() {
    it("should return all todos", function(done){
        var TodoMock = sinon.mock(Todo);
        var expectedResult = {status: true, todo: []};
        TodoMock.expects('find').yields(null, expectedResult);
        Todo.find(function (err, result) {
            TodoMock.verify();
            TodoMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
});

describe("Save a todo", function() {
    it("should save a todo", function(done) {
        
    });
});