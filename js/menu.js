/* 		$(document).ready(function() {
				$(".btn").click(function(e) {
					e.stopPropagation(); //阻止冒泡 
					$(".dropdown").slideToggle(); //切换子菜单的显示或隐藏状态  
					if ($(".dropdown").is(":visible")) { //判断子菜单是否可见   
						$(document).one("click", function() { //如果可见就为documnet对象绑定个一次性的单击事件       
							$(".dropdown").hide();
						});
					}
				});
				//以上可以实现点击任意区域下拉菜单收起的效果，如果要想点击子菜单而子菜单不收起，给子菜单阻止冒泡就可以了，如下：
				$(".dropdown").on("click", function(e) {
					e.stopPropagation();
				})
			}); 
			*/
		  //点击出现下拉框
//		  $(document).ready(function() {
			$(".menudu").click(function(event){
				var type = $(this).attr("data-type");
				click_index = $(this).index();
				if(type=="0"){
					$(this).find("ul").slideDown();//下拉
					$(this).attr("data-type","1");
				}else{
					$(this).find("ul").slideUp();//收起
					$(this).attr("data-type","0");
				}
			})
			// 点input不隐藏
			$(".ipt").on("click", function(e) {
								e.stopPropagation();
			 				}) 
			// 点其他地方下拉框隐藏
			$(document).mouseup(function (e) {
		        var _con = $('.menudu ul');
		        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
		            $('.menudu ul').slideUp();
		            $(".menudu").attr("data-type","0");
		        }
		    })
//               });