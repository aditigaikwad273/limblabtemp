class PasswordsController < ApplicationController
  def new
    @password = Password.new
  end

  def create
    @password = Password.new(create_params)

    if user = (@password.request(Admin) || @password.request(Clinician) || @password.request(Client))
      PasswordMailer.requested(user).deliver_later      
      flash[:notice] = "Please check your email for a password setup request"
      case user
      when Admin
        redirect_to sign_in_url
      else
        redirect_to new_password_url
      end
    else
      render :new
    end
  end

  def edit
    @password = Password.new(password_reset_token: params[:password_reset_token])
  end

  def update
    @password = Password.new(update_params.merge(password_reset_token: params[:password_reset_token]))

    if user = (@password.reset(Admin) || @password.reset(Clinician) || @password.reset(Client))
      PasswordMailer.reset(user).deliver_later
      case user
      when Admin
        flash[:notice] = "Your password has been updated successfully"
        sign_in user
        redirect_to root_url
      else
        flash[:notice] = "Your password has been updated successfully, please return to the app to login"
        redirect_to new_password_url
      end
    else
      render :edit
    end
  end

  private

  def create_params
    params.require(:password).permit(:email)
  end

  def update_params    
    params.require(:password).permit(:password)
  end
end
