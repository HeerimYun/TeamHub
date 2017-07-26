HTTP.methods({
    /**
     * 통신 테스트용 메서드
     * @param data
     * @returns {{status: string}}
     */
    'test': function (data) {
      console.log(data);
        return{
          status: 'success'
      }  
    },
    
    /**
     * 글 작성 메서드
     * @param data
     */
    'insertPost': function (data) {
        var jsonData = JSON.parse(data);

        //초기화
        jsonData.createdAt = new Date();
        jsonData.count = 0;
        jsonData.comments = [];

        postDB.insert(jsonData);

        return {
            status: 'success'
        }

    },
    /**
     * 글 가져오는 메서드
     * @param data
     * @returns {{status: string, data: any}}
     */
    'getPosts': function (data) {
        var jsonData = JSON.parse(data); //추후 활용가능

        //전체를 가지고 옴
        var posts = postDB.find({}).fetch();

        return {
            status: 'success',
            data: posts
        }
    },

    /**
     * 특정 글 가져오는 메서드
     * @param data
     * @returns {{status: string, data: any}}
     */
    'getPost': function (data) {
        var jsonData = JSON.parse(data);
        var post = postDB.findOne({_id: jsonData._id});

        return {
            status: 'success',
            data: post
        }
    },

    /**
     * 글 지우는 메서드
     * @param data
     * @returns {{status: string}}
     */
    'removePost':function (data) {
        var jsonData = JSON.parse(data);
        postDB.remove({_id: jsonData._id});

        return {
            status: 'success'
        }
    },

    /**
     * 글 수정 메서드
     * @param data
     * @returns {{status: string}}
     */
    'updatePost': function (data) {
        var jsonData = JSON.parse(data);

        //title과 body가 없으면 에러가 나므로 일단 존재하는지 검증

        //방법1) 초보자 방법
        /*       var keys = Object.getOwnPropertyNames(jsonData);

               //만약 제목, 본문, 아이디 중 하나라도 없으면 에러 처리
               if ((keys.indexOf('title') === -1) || (keys.indexOf('body') === -1) || (keys.indexOf('_id') === -1)) {
                   return {
                       status: '필수 항목이 없습니다.'
                   }
               }*/

        //둘다 같은 것을 내지만,
        //jsonData['title'] //값이 없을 시 ,undefined를 반환
        //jsonData.title //값이 없으면 에러가남

        if ((jsonData['title'] === undefined) || (jsonData['body'] === undefined) | (jsonData['_id'] === undefined)) {
            return {
                status: '필수 항목이 없습니다.'
            }
        }

        postDB.update({_id: jsonData._id}, {
            $set: {
                title: jsonData.title,
                body: jsonData.body
            }
        });
        return {
            status: 'success'
        }
    },

    /**
     * 조회수 추가 메서드
     * @param data
     * @returns {{status: string}}
     */
    'countUpPost': function (data) {
        var jsonData = JSON.parse(data);

        //글목록에서 클릭 시 해당 글을 클릭할 시 조회수를 올린다.
        var post = postDB.findOne({_id: jsonData._id});

        var count = post.count + 1;

        postDB.update({_id: jsonData._id}, {
            $set: {
                count: count
            }
        });

        return {
            status: 'success'
        }
    },


    /**
     * 코멘트 추가 메서드
     * @param data
     * @returns {{status: string}}
     */
    'addComment': function (data) {
        var jsonData = JSON.parse(data); //작성자, 시간, 코멘트 내용, 어떤 게시글에 대한 정보

        var obj = {
            username: jsonData.username,
            createdAt: new Date(),
            comment: jsonData.comment
        }

        var post = postDB.findOne({_id: jsonData._id});

        post.comments.push(obj);

        postDB.update({_id: jsonData._id}, post);

        return {
            status: 'success'
        }
    },

    /**
     * 댓글 삭제 메서드
     * @param data
     * @returns {*}
     */
    'removeComment': function (data) {
        var jsonData = JSON.parse(data);

        //댓글 삭제할 사람이 작성자 본인인지 확인
        var post = postDB.findOne({_id: jsonData._id});
        var comment = post.comments[jsonData.commentIndex]; //삭제하려는 댓글

        if(comment.username !== jsonData.username) {
            return {
                status: '코멘트 작성자만 삭제 가능합니다.'
            }
        }

        //맞으면 댓글 삭제

        post.comments.splice(jsonData.commentIndex, 1);
        postDB.update({_id: jsonData._id}, post);
        return {
            status: 'success'
        }
    },

    /**
     * 글 검색 메서드
     * @param data
     * @returns {{status: string, data: any}}
     */
    'searchPost': function (data) {
        var jsonData = JSON.parse(data);

        var posts = postDB.find({
            $or: [
                {title: new RegExp(jsonData.searchText, 'i')},
                {body: new RegExp(jsonData.searchText, 'i')},
                {username: new RegExp(jsonData.searchText, 'i')}
            ]
        }).fetch();

        return {
            status: 'success',
            data: posts
        }
    },
    /**
     * 로그인 메서드
     * @param data
     * @returns {*}
     */
    'userLogin': function (data) {
        var jsonData = JSON.parse(data); //입력받은 정보를 json data로 바꿈

        //username으로 db에 회원이 있는지 체크, 있으면 성공! 없을 시 || 비밀번호 틀리면 에러 리턴

        //회원 존재하면 뭔가 담김
        var obj = userDB.findOne(
            {username: jsonData.username}
        );

        //회원이 없거나, 비번이 틀림 (존재하는 회원정보랑 입력받은 정보를 비교)
        if ((obj === undefined) || (obj.password !== jsonData.password)) {
            return {
                status: '회원이 없거나 비밀번호가 틀렸습니다.'
            }
        }
        //로그인 성공함!
        return {
            status: '로그인 성공, ' + obj.username + ' 님 환영합니다.'
        }
    },

    /**
     * 회원가입 메서드
     * @param data
     * @returns {*}
     */
    'join': function (data) {
        var jsonData = JSON.parse(data);


        //현재 함수를 종료시키자 (여러 조건을 맞춘경우만 가입승인, 조건이 하나라도 안맞으면 종료)

        //기존 아이디가 있으면 가입 불가
        var obj = userDB.findOne( //맨 먼저 만난 놈을 json Object 를 반환
            {username: jsonData.username} //가입할려는 유저(data.username)과 db의 username을 비교
        );

        console.log(obj); //찾으면 해당 아이디 유저객체가 나오고 없으면 undefined(=null)이 나옴

        if (obj !== undefined) { //이미 동일 아이디의 회원이 존재하면
            //가입 불가하므로 그냥 함수 종료
            return {
                status: '기존 회원이 있습니다.'
            }
        }

        //비밀번호와 비밀번호 확인이 다르면 거절 (보통 클라이언트에서 막음)
        if (jsonData.password !== jsonData.passwordConfirm) {
            return {
                status: '비밀번호가 일치하지 않습니다.'
            }
        }

        //비밀번호 자리수 (최대 8자리)
        if ((jsonData.password.length < 4) || (jsonData.password.length > 8)) { //4자리 보다 작거나 8자리보다 크면 안됌
            return {
                status: '비밀번호는 최소 4자리에서 최대 8자리입니다.'
            }
        }

        //아이디 자리수 (최대 8자리)
        if ((jsonData.username.length) < 4 || (jsonData.username.length > 12)) { //4자리 보다 작거나 12자리보다 크면 안됌
            return {
                status: '아이디는 최소 4자리에서 최대 12자리입니다.'
            }
        }


        //정상 가입후 이메일 인증 통해 인증이 되어야 정상회원으로 등급업 함

        //모든 조건을 충족한 정상적 가입할 회원
        jsonData.createdAt = new Date();
        userDB.insert(jsonData); //받은 data를 DB에 넣음

        return {
            'status': 'success'
        }
    },
    /**
     * 회원 정보 업데이트 메서드
     * @param data
     */
    'updateUser': function (data) {
        var jsonData = JSON.parse(data);

        //정보를 수정할 유저가 존재하면 정보를 업뎃해줌, 없으면 에러

        var user = userDB.findOne({
            username: jsonData.username

        });

        if ((user.username === undefined)) {
            return {
                'status': '해당 회원이 존재하지 않습니다.'
            };
        }

        //방법1) 해당 유저의 정보를 바꾸고, 객체에 저장해서 update 함수에 파라미터로 넘겨줌
        //user.nickname = jsonData.nickname; //닉네임이란 정보를 추가
        //user.address = jsonData.address; //주소란 정보를 추가
        //userDB.update({username: jsonData.username}, user);

        //방법2) 특정 data의 특정 필드만 수정, 이 방법 권장
        userDB.update({username: jsonData.username}, {
            $set: { //해당 필드만 바꿈 set오브젝트
                address: jsonData.address,
                phone: jsonData.phone,
                nickname: jsonData.nickname
            }
        });

        return {
            'status': 'success'
        };
    },

    'removeUser': function (data) {
        var jsonData = JSON.parse(data);

        var result = userDB.remove({username: jsonData.username});

        if (result !== 1) {
            return {
                status: '데이터 삭제 실패'
            }
        }

        return {
            status: 'success'
        };
    }
});
