# MakeFile 通用
# $(CXX)默认g++
# $^ 依赖 不重复
# $@生成目标
# @不显示命令执行 -失败不停止
TARGET=json
LIBS=
OBJS=json.o
LDFLAGS=-shared
CXXFLAGS=-fPIC
$(TARGET):$(OBJS)
	$(CXX) $^ -o $@ $(LIBS)

so:$(OBJS)
	$(CXX) $(LDFLAGS) $^ -o lib$(TARGET).so

clean:
	@$(RM) $(OBJS) $(TARGET) lib$(TARGET).so

.PHONY:clean
