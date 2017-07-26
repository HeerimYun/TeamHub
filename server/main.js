//테스트 코드용, 바로 실행해서 보여줄 수 있음 (restApi.js와 분리하여 여기는 테스트코드만!)
//초기화 작업 (기본 세팅 작업)
// ex: admin 계정이 없으면 만들어라

var user = userDB.findOne({username: 'admin'});

//관리자가 없다면 생성
if (user === undefined) {
    //admin 생성
    userDB.insert({
        username: 'admin',
        password: 'admin'
    });
}

//var temp = testDB.find({name: 'test data', index: 0}); //find는 cursor를 가져온다, 그리고 콤마로 여러 조건을 나열할수있다 다만 and연산을 한다. or로 바꿔줄 수 도 있다.
//console.log(temp.fetch());
//temp.count() 로 하면 데이터의 개수만 나옴


//console.log(userDB.findOne({username: 'admin'}));

//for문 돌면서 data 만 개를 넣는 코드 작성

/*
for (var i=0; i<10000; i++) {
    testDB.insert({
        index: i,
        name: 'test data',
        boolean: true
    });
}*/


