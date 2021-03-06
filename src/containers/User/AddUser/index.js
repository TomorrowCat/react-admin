import React from 'react'
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, Radio, Cascader, message } from 'antd'
import userActions from '@/redux/models/user'
import { buildTree } from '@/redux/models/department'
import './AddUser.scss'

const FormItem  = Form.Item;

class AddUser extends React.Component {
    static defaultProps = {
        visiable: false,
        cancel: () => {},
        success: () => {},
    };

    state = {
        isActive: true,
        gender: 1,
    };

    submitUser = e => {
        const { form, addUser, success } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                if (values.department.length > 0) {
                    values.department = values.department[values.department.length - 1];
                } else {
                    delete values.department;
                }
                addUser({
                    input: values,
                    callback: (resp) => {
                        message.success('用户添加成功');
                        success(resp);
                        form.resetFields();
                    },
                });
            }
        });
    };

    render() {
        const { visiable, cancel, form, loading, departmentList } = this.props;
        const { isActive, gender } = this.state;
        const { getFieldDecorator } = form;
        // Cascader组件有个bug, 会修改传入的数据对象, 所以下面每次都深拷贝一个新的对象
        const departments = eval(JSON.stringify(departmentList));

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        const prefixSelector = <Select defaultValue="86" style={{ width: 60 }}>
            <Select.Option value="86">+86</Select.Option>
        </Select>;

        return <div className="add-user-modal">
            <Modal
                title="添加用户"
                wrapClassName="vertical-center-modal"
                visible={ visiable }
                confirmLoading={ loading }
                onOk={ this.submitUser }
                onCancel={ cancel }
                okText="提交"
                cancelText="取消"
            >
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label="用户名"
                        className="add-user-item"
                        hasFeedback={ true }
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入用户名',
                                whitespace: true
                            }],
                        })(
                            <Input name="username" />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="真实姓名"
                        className="add-user-item"
                        hasFeedback={ true }
                    >
                        {getFieldDecorator('realName', {
                            rules: [{
                                required: true, message: '请输入真实姓名',
                                whitespace: true
                            }],
                        })(
                            <Input name="realName" />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="性别"
                        className="add-user-item"
                        hasFeedback={ false }
                    >
                        {getFieldDecorator('gender', {
                            initialValue: gender,
                        })(
                            <Radio.Group name="gender" onChange={ e => { this.setState({gender: e.target.value}) } }>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="手机号码"
                        className="add-user-item"
                        hasFeedback={ true }
                    >
                        {getFieldDecorator('mobile', {
                            rules: [{
                                pattern: /^1[34578]\d{9}$/, message: '手机号码格式错误',
                            }, {
                                required: true, message: '请输入手机号码',
                            }],
                        })(
                            <Input name="mobile" addonBefore={ prefixSelector } style={{ width: '100%' }} />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="电子邮箱"
                        className="add-user-item"
                        hasFeedback={ true }
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '电子邮箱格式错误',
                            }, {
                                required: true, message: '请输入电子邮箱',
                            }],
                        })(
                            <Input name="email"/>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="所属部门"
                        className="add-user-item"
                    >
                        {getFieldDecorator('department', {
                            initialValue: [],
                            rules: [{ type: 'array' }],
                        })(
                            <Cascader
                                options={ buildTree(departments) }
                                placeholder="请选择部门"
                                changeOnSelect
                            />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="密码"
                        className="add-user-item"
                        hasFeedback={ true }
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入密码',
                            }, {
                                min: 6, message: '密码不能少于6位',
                            }],
                        })(
                            <Input name="password" type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label="状态"
                        className="add-user-item"
                        hasFeedback={ false }
                    >
                        {getFieldDecorator('isActive', {
                            initialValue: isActive,
                        })(
                            <Radio.Group name="isActive">
                                <Radio value={true}>正常</Radio>
                                <Radio value={false}>停用</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }
}

const AddUserForm = Form.create()(AddUser);

const mapStateToProps = (state) => {
    let { global, department } = state;
    return {
        loading: global.loading,
        departmentList: department.departmentList.edges,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    addUser: (params) => dispatch(userActions.addUser(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUserForm)
